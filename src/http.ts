import express, { Request, Response } from "express";
import cors from "cors";
import { randomUUID } from "node:crypto";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  CallToolRequest,
} from "@modelcontextprotocol/sdk/types.js";
import { AVAILABLE_TOOLS } from "./tools/index.js";

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
      version: "1.2.3",
    },
    {
      capabilities: {
        tools: {},
      },
    },
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: AVAILABLE_TOOLS.map((tool) => tool.getToolDefinition()),
    };
  });

  server.setRequestHandler(
    CallToolRequestSchema,
    async (request: CallToolRequest) => {
      if (!apiKey)
        throw new Error("API key required. Please provide x-api-key header.");

      const { name, arguments: args } = request.params;

      const tool = AVAILABLE_TOOLS.find(
        (t) => t.getToolDefinition().name === name,
      );

      if (!tool) {
        throw new Error(`Unknown tool: ${name}`);
      }

      const toolClass = Object.getPrototypeOf(tool).constructor;
      const toolInstance = new toolClass(apiKey);

      return await toolInstance.execute(args || {});
    },
  );

  return server;
};

export class TokenMetricsHTTPServer {
  private app: express.Application;
  private port: number;
  private transports: { [sessionId: string]: StreamableHTTPServerTransport } =
    {};

  constructor(port: number = 3000) {
    this.port = port;
    this.app = express();

    this.setupMiddleware();
    this.setupRoutes();
  }

  private setupMiddleware(): void {
    this.app.use(
      cors({
        origin: true,
        credentials: true,
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
        version: "1.2.3",
        service: "Token Metrics MCP Server",
      });
    });

    this.app.post("/", this.handleMCPRequest.bind(this));

    this.app.get("/", this.handleMCPGetRequest.bind(this));

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

      const sessionId = req.headers["mcp-session-id"] as string | undefined;
      let transport: StreamableHTTPServerTransport;

      if (sessionId && this.transports[sessionId]) {
        transport = this.transports[sessionId];
      } else if (!sessionId && isInitializeRequest(req.body)) {
        const apiKey = req.get("x-api-key");

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
        const apiKey = req.get("x-api-key");
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

      const sessionId = req.headers["mcp-session-id"] as string | undefined;
      if (!sessionId || !this.transports[sessionId]) {
        res.status(405).set("Allow", "POST").send("Method Not Allowed");
        return;
      }

      console.log(`Establishing SSE stream for session ${sessionId}`);
      const transport = this.transports[sessionId];
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

  private isValidRequest(req: Request): boolean {
    const host = req.get("Host");
    const origin = req.get("Origin");

    // If no host header, reject (required for HTTP/1.1)
    if (!host) {
      return false;
    }

    // Check for DNS rebinding attack patterns
    if (origin && this.isPotentialDNSRebinding(host, origin)) {
      return false;
    }

    // Allow requests without Origin header (direct API calls, curl, etc.)
    if (!origin) {
      return true;
    }

    // Allow same-origin requests
    if (this.isSameOrigin(host, origin)) {
      return true;
    }

    // Allow localhost/127.0.0.1 origins (development)
    if (this.isLocalhostOrigin(origin)) {
      return true;
    }

    // Allow all other origins (but they passed DNS rebinding check above)
    return true;
  }

  private isPotentialDNSRebinding(host: string, origin: string): boolean {
    // DNS rebinding attack pattern:
    // - Host header points to localhost/private IP
    // - Origin header is from external domain

    const isLocalHost = this.isLocalHost(host);
    const isLocalOrigin = this.isLocalhostOrigin(origin);

    // If host is localhost but origin is not, potential DNS rebinding
    return (
      isLocalHost && !isLocalOrigin && !this.isAllowedExternalOrigin(origin)
    );
  }

  private isLocalHost(host: string): boolean {
    const hostname = host.split(":")[0]; // Remove port
    return (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "::1" ||
      hostname.startsWith("192.168.") ||
      hostname.startsWith("10.") ||
      hostname.startsWith("172.16.") ||
      hostname.startsWith("172.17.") ||
      hostname.startsWith("172.18.") ||
      hostname.startsWith("172.19.") ||
      hostname.startsWith("172.2") ||
      hostname.startsWith("172.30.") ||
      hostname.startsWith("172.31.")
    );
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

  private isAllowedExternalOrigin(origin: string): boolean {
    const allowedExternalOrigins: string[] = [];

    return allowedExternalOrigins.includes(origin);
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
