import express, { Request, Response } from "express";
import cors from "cors";
import { randomUUID } from "node:crypto";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  CallToolRequest,
} from "@modelcontextprotocol/sdk/types.js";
import { OPENAI_TOOLS } from "./tools/index.js";

interface MCPRequest extends Request {
  body: any;
}

function isInitializeRequest(request: any): boolean {
  return request && request.method === "initialize";
}

const getServer = (apiKey?: string) => {
  const server = new Server(
    {
      name: "Token Metrics MCP Server",
      version: "1.4.0",
    },
    {
      capabilities: {
        tools: {},
      },
    },
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: OPENAI_TOOLS.map((tool) => tool.getToolDefinition()),
    };
  });

  server.setRequestHandler(
    CallToolRequestSchema,
    async (request: CallToolRequest) => {
      if (!apiKey)
        throw new Error("API key required. Please provide x-api-key header.");

      const { name, arguments: args } = request.params;

      const tool = OPENAI_TOOLS.find(
        (t) => t.getToolDefinition().name === name,
      );

      if (!tool) {
        throw new Error(`Unknown tool: ${name}`);
      }

      const toolClass = Object.getPrototypeOf(tool).constructor;
      const toolInstance = new toolClass(apiKey);

      return await toolInstance.execute(args ?? {});
    },
  );

  return server;
};

export class TokenMetricsHTTPServer {
  readonly app: express.Application;
  readonly port: number;
  private transports: {
    [sessionId: string]: StreamableHTTPServerTransport | SSEServerTransport;
  } = {};

  constructor(port: number = 3000) {
    this.port = port;
    this.app = express();

    this.setupMiddleware();
    this.setupRoutes();
  }

  private setupMiddleware(): void {
    this.app.use(
      cors({
        origin: (origin, callback) => {
          if (!origin) {
            return callback(null, true);
          }

          console.log("CORS: Checking origin:", origin);
          return callback(null, true);
        },
        credentials: true,
        methods: ["GET", "POST", "OPTIONS"],
        allowedHeaders: [
          "Content-Type",
          "x-api-key",
          "Authorization",
          "mcp-session-id",
          "x-integration",
        ],
      }),
    );

    this.app.use(express.json());

    this.app.use((req, res, next) => {
      res.setHeader("X-Content-Type-Options", "nosniff");
      res.setHeader("X-Frame-Options", "DENY");
      res.setHeader("X-XSS-Protection", "1; mode=block");
      next();
    });
  }

  private setupRoutes(): void {
    this.app.get("/health", (req, res) => {
      return res.status(200).json({
        status: "healthy",
        timestamp: new Date().toISOString(),
        version: "1.4.0",
        service: "Token Metrics MCP Server",
      });
    });

    this.app.post("/", this.handleMCPRequest.bind(this));

    this.app.get("/", this.handleMCPGetRequest.bind(this));

    this.app.all("/sse", async (req: Request, res: Response) => {
      if (req.method === "OPTIONS") {
        this.handleSSEOptionsRequest(req, res);
        return;
      }

      const validationResult = this.validateSSERequest(req, res);
      if (!validationResult) return;

      try {
        await this.setupSSEConnection(req, res);
      } catch (error) {
        this.handleSSEConnectionError(error, res);
      }
    });

    this.app.post("/messages", async (req: Request, res: Response) => {
      console.log("Received POST request to /messages", {
        sessionId: req.query.sessionId,
        body: req.body,
        headers: req.headers,
      });

      if (!this.isValidRequest(req)) {
        console.log(
          "/messages request blocked - potential DNS rebinding attack",
          {
            host: req.get("Host"),
            origin: req.get("Origin"),
            userAgent: req.get("User-Agent"),
          },
        );
        res.status(403).json({
          error: "Invalid request - potential DNS rebinding attack",
          code: -32600,
        });
        return;
      }

      const sessionId = req.query.sessionId as string;

      if (!sessionId) {
        console.log("No sessionId provided in /messages request");
        res.status(400).json({
          jsonrpc: "2.0",
          error: {
            code: -32000,
            message: "Bad Request: sessionId query parameter is required",
          },
          id: null,
        });
        return;
      }

      console.log(`Looking for transport with sessionId: ${sessionId}`);
      console.log(`Available transports: ${Object.keys(this.transports)}`);

      let transport: SSEServerTransport;
      const existingTransport = this.transports[sessionId];

      if (existingTransport instanceof SSEServerTransport) {
        console.log(`Found SSE transport for session: ${sessionId}`);
        transport = existingTransport;
      } else if (existingTransport) {
        console.log(
          `Transport exists but wrong type for session: ${sessionId}`,
        );
        res.status(400).json({
          jsonrpc: "2.0",
          error: {
            code: -32000,
            message:
              "Bad Request: Session exists but uses a different transport protocol",
          },
          id: null,
        });
        return;
      } else {
        console.log(`No transport found for sessionId: ${sessionId}`);
        res.status(400).json({
          jsonrpc: "2.0",
          error: {
            code: -32000,
            message: "Bad Request: No transport found for sessionId",
          },
          id: null,
        });
        return;
      }

      try {
        console.log(`Handling POST message for session: ${sessionId}`);
        await transport.handlePostMessage(req, res, req.body);
        console.log(
          `Successfully handled POST message for session: ${sessionId}`,
        );
      } catch (error) {
        console.error(
          `Error handling POST message for session: ${sessionId}`,
          error,
        );
        if (!res.headersSent) {
          res.status(500).json({
            jsonrpc: "2.0",
            error: {
              code: -32603,
              message: "Internal server error",
            },
            id: req.body?.id ?? null,
          });
        }
      }
    });

    this.app.use("*", (req, res) => {
      res.status(404).json({ error: "Endpoint not found" });
    });
  }

  private async handleMCPRequest(
    req: MCPRequest,
    res: Response,
  ): Promise<void> {
    console.log("Received MCP request:", req.body);

    try {
      if (!this.isValidRequest(req)) {
        res.status(403).json({
          error: "Invalid request - potential DNS rebinding attack",
          code: -32600,
        });
        return;
      }

      const sessionId = req.get("mcp-session-id");
      let transport: StreamableHTTPServerTransport;

      if (sessionId && this.transports[sessionId]) {
        transport = this.transports[sessionId] as StreamableHTTPServerTransport;
      } else if (!sessionId && isInitializeRequest(req.body)) {
        transport = new StreamableHTTPServerTransport({
          sessionIdGenerator: () => randomUUID(),
          enableJsonResponse: true,
          onsessioninitialized: (sessionId) => {
            console.log(`Session initialized with ID: ${sessionId}`);
            this.transports[sessionId] = transport;
          },
        });

        transport.onclose = () => {
          if (transport.sessionId) {
            delete this.transports[transport.sessionId];
          }
        };

        const apiKey = req.get("x-api-key") ?? (req.query.apiKey as string);
        const server = getServer(apiKey);
        await server.connect(transport);
        await transport.handleRequest(req, res, req.body);
        return;
      } else {
        res.status(400).json({
          jsonrpc: "2.0",
          error: {
            code: -32000,
            message: "Bad Request: No valid session ID provided",
          },
          id: null,
        });
        return;
      }

      if (req.body.method === "tools/call") {
        const apiKey = req.get("x-api-key") ?? req.query.apiKey;
        if (!apiKey) {
          res.status(400).json({
            jsonrpc: "2.0",
            error: {
              code: -32600,
              message: "API key required. Please provide x-api-key header.",
            },
            id: req.body.id || null,
          });
          return;
        }
      }

      await transport.handleRequest(req, res, req.body);
    } catch (error) {
      console.error("Error handling MCP request:", error);
      if (!res.headersSent) {
        res.status(500).json({
          jsonrpc: "2.0",
          error: {
            code: -32603,
            message: "Internal server error",
          },
          id: req.body?.id || null,
        });
      }
    }
  }

  private async handleMCPGetRequest(
    req: Request,
    res: Response,
  ): Promise<void> {
    try {
      if (!this.isValidRequest(req)) {
        res.status(403).json({
          error: "Invalid request - potential DNS rebinding attack",
        });
        return;
      }

      const sessionId = req.get("mcp-session-id");
      if (!sessionId || !this.transports[sessionId]) {
        res.status(405).set("Allow", "POST").send("Method Not Allowed");
        return;
      }

      console.log(`Establishing SSE stream for session ${sessionId}`);
      const transport = this.transports[
        sessionId
      ] as StreamableHTTPServerTransport;
      await transport.handleRequest(req, res);
    } catch (error) {
      console.error("Error handling MCP GET request:", error);
      if (!res.headersSent) {
        res.status(500).json({
          error: "Internal server error",
        });
      }
    }
  }

  private handleSSEOptionsRequest(req: Request, res: Response): void {
    res.setHeader("Access-Control-Allow-Origin", req.get("Origin") ?? "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, x-api-key, Authorization, mcp-session-id",
    );
    res.setHeader("Access-Control-Max-Age", "86400"); // 24 hours
    res.status(200).end();
  }

  private validateSSERequest(req: Request, res: Response): boolean {
    if (!["GET", "POST"].includes(req.method)) {
      res.status(405).send("Method Not Allowed");
      return false;
    }

    if (!this.isValidRequest(req)) {
      console.log("SSE request blocked - potential DNS rebinding attack", {
        host: req.get("Host"),
        origin: req.get("Origin"),
        userAgent: req.get("User-Agent"),
      });
      res.status(403).json({
        error: "Invalid request - potential DNS rebinding attack",
        code: -32600,
      });
      return false;
    }

    console.log(
      `Received ${req.method} request to /sse (deprecated SSE transport)`,
      {
        host: req.get("Host"),
        origin: req.get("Origin"),
        userAgent: req.get("User-Agent"),
      },
    );

    return true;
  }

  private setSSEHeaders(req: Request, res: Response): void {
    res.setHeader("Access-Control-Allow-Origin", req.get("Origin") ?? "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, x-api-key, Authorization",
    );
    res.setHeader("X-Accel-Buffering", "no");
  }

  private async setupSSEConnection(req: Request, res: Response): Promise<void> {
    console.log("Setting up SSE transport...");

    this.setSSEHeaders(req, res);

    console.log("Creating SSE transport...");
    const transport = new SSEServerTransport("/messages", res);
    console.log(
      `SSE transport created with session ID: ${transport.sessionId}`,
    );

    this.transports[transport.sessionId] = transport;

    console.log("Getting API key and creating server...");
    const apiKey = req.get("x-api-key") ?? (req.query.apiKey as string);
    const server = getServer(apiKey);

    console.log("Connecting server to transport...");
    await server.connect(transport);
    console.log("SSE connection established successfully");

    this.setupSSEEventHandlers(transport, res);
  }

  private setupSSEEventHandlers(
    transport: SSEServerTransport,
    res: Response,
  ): void {
    const pingInterval = setInterval(() => {
      if (!res.destroyed) {
        try {
          res.write(": ping\n\n");
        } catch (error) {
          console.error("Error sending ping:", error);
          clearInterval(pingInterval);
        }
      } else {
        clearInterval(pingInterval);
      }
    }, 30000);

    res.on("close", () => {
      console.log(`SSE connection closed for session: ${transport.sessionId}`);
      clearInterval(pingInterval);
      delete this.transports[transport.sessionId];
    });

    res.on("error", (error) => {
      console.error(
        `SSE connection error for session: ${transport.sessionId}`,
        error,
      );
      clearInterval(pingInterval);
      delete this.transports[transport.sessionId];
    });
  }

  private handleSSEConnectionError(error: unknown, res: Response): void {
    console.error("Error setting up SSE transport:", error);
    console.error(
      "Error stack:",
      error instanceof Error ? error.stack : "No stack trace",
    );

    if (!res.headersSent) {
      res.status(500).json({
        error: "Failed to establish SSE connection",
        message: error instanceof Error ? error.message : String(error),
      });
    } else {
      try {
        res.write("event: error\n");
        res.write(
          `data: {"error": "${
            error instanceof Error ? error.message : String(error)
          }"}\n\n`,
        );
        res.end();
      } catch (writeError) {
        console.error("Failed to write error to SSE stream:", writeError);
      }
    }
  }

  private isValidRequest(req: Request): boolean {
    const host = req.get("Host");
    const origin = req.get("Origin");
    const userAgent = req.get("User-Agent");

    console.log("Validating request:", {
      host,
      origin,
      userAgent,
      method: req.method,
      url: req.url,
    });

    // If no host header, reject (required for HTTP/1.1)
    if (!host) {
      console.log("Request rejected: No Host header");
      return false;
    }

    // Check for DNS rebinding attack patterns
    if (origin && this.isPotentialDNSRebinding(host, origin)) {
      console.log("Request rejected: Potential DNS rebinding attack", {
        host,
        origin,
      });
      return false;
    }

    // Allow requests without Origin header (direct API calls, curl, etc.)
    if (!origin) {
      console.log("Request allowed: No Origin header (direct API call)");
      return true;
    }

    // Allow same-origin requests
    if (this.isSameOrigin(host, origin)) {
      console.log("Request allowed: Same origin");
      return true;
    }

    // Allow localhost/127.0.0.1 origins (development)
    if (this.isLocalhostOrigin(origin)) {
      console.log("Request allowed: Localhost origin");
      return true;
    }

    // Allow all other origins (but they passed DNS rebinding check above)
    console.log("Request allowed: External origin passed DNS rebinding check");
    return true;
  }

  private isPotentialDNSRebinding(host: string, origin: string): boolean {
    // DNS rebinding attack pattern:
    // - Host header points to localhost/private IP
    // - Origin header is from external domain

    const isLocalHost = this.isLocalHost(host);
    const isLocalOrigin = this.isLocalhostOrigin(origin);

    // If host is localhost but origin is not, potential DNS rebinding
    return isLocalHost && !isLocalOrigin;
  }

  private isLocalHost(host: string): boolean {
    const hostname = host.split(":")[0]; // Remove port

    // Check for localhost variations
    if (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "::1"
    ) {
      return true;
    }

    // Check for private IP ranges
    if (hostname.startsWith("192.168.") || hostname.startsWith("10.")) {
      return true;
    }

    // Check for 172.16.0.0 - 172.31.255.255 range properly
    if (hostname.startsWith("172.")) {
      const parts = hostname.split(".");
      if (parts.length >= 2) {
        const secondOctet = parseInt(parts[1], 10);
        return secondOctet >= 16 && secondOctet <= 31;
      }
    }

    return false;
  }

  private isLocalhostOrigin(origin: string): boolean {
    return (
      origin.includes("localhost") ||
      origin.includes("127.0.0.1") ||
      origin.includes("::1") ||
      origin.includes("192.168.") ||
      origin.includes("10.") ||
      origin.includes("172.16.") ||
      origin.includes("172.17.") ||
      origin.includes("172.18.") ||
      origin.includes("172.19.") ||
      origin.includes("172.2") ||
      origin.includes("172.30.") ||
      origin.includes("172.31.") ||
      origin.startsWith("file://")
    );
  }

  private isSameOrigin(host: string, origin: string): boolean {
    try {
      const originUrl = new URL(origin);
      return originUrl.host === host;
    } catch {
      return false;
    }
  }

  public async start(): Promise<void> {
    return new Promise((resolve) => {
      this.app.listen(this.port, "0.0.0.0", () => {
        console.error(
          `Token Metrics MCP HTTP Server running on port: ${this.port}`,
        );
        resolve();
      });
    });
  }
}

async function main(): Promise<void> {
  const server = new TokenMetricsHTTPServer();
  await server.start();
}

process.on("SIGINT", async () => {
  console.log("Shutting down server...");
  process.exit(0);
});

main().catch((error: unknown) => {
  console.error(
    "Failed to start server:",
    error instanceof Error ? error.message : String(error),
  );
  process.exit(1);
});
