import express, { Request, Response } from "express";
import cors from "cors";
import { AVAILABLE_TOOLS } from "./tools/index.js";

interface JSONRPCRequest {
  jsonrpc: string;
  method: string;
  params?: any;
  id: string | number | null;
}

interface JSONRPCResponse {
  jsonrpc: string;
  id: string | number | null;
  result?: any;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
}

interface MCPRequest extends Request {
  body: JSONRPCRequest;
}

export class TokenMetricsHTTPServer {
  private app: express.Application;
  private port: number;

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
    this.app.post("/", this.handleMCPRequest.bind(this));

    this.app.use("*", (req, res) => {
      res.status(404).json({ error: "Endpoint not found" });
    });
  }

  private async handleMCPRequest(
    req: MCPRequest,
    res: Response,
  ): Promise<void> {
    try {
      // Prevent DNS rebinding attacks
      if (!this.isValidRequest(req)) {
        res.status(403).json({
          error: "Invalid request - potential DNS rebinding attack",
          code: -32600,
        });
        return;
      }

      const jsonrpcRequest = req.body;

      if (!this.isValidJSONRPCRequest(jsonrpcRequest)) {
        res.status(400).json({
          jsonrpc: "2.0",
          error: {
            code: -32600,
            message: "Invalid JSON-RPC request",
          },
          id: (jsonrpcRequest as any)?.id || null,
        });
        return;
      }

      const apiKey = req.get("x-api-key");

      const response = await this.processJSONRPCRequest(jsonrpcRequest, apiKey);

      const acceptHeader = req.get("Accept") || "";
      const supportsSSE = acceptHeader.includes("text/event-stream");

      if (supportsSSE && this.shouldStream(jsonrpcRequest)) {
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");

        res.write(`data: ${JSON.stringify(response)}\n\n`);
        res.end();
      } else {
        res.setHeader("Content-Type", "application/json");
        res.json(response);
      }
    } catch (error) {
      console.error("Error handling MCP request:", error);
      res.status(500).json({
        jsonrpc: "2.0",
        error: {
          code: -32603,
          message: "Internal error",
          data: error instanceof Error ? error.message : String(error),
        },
        id: req.body?.id || null,
      });
    }
  }

  private async processJSONRPCRequest(
    request: JSONRPCRequest,
    apiKey: string | undefined,
  ): Promise<JSONRPCResponse> {
    try {
      if (request.method === "initialize") {
        const result = {
          protocolVersion: "2024-11-05",
          capabilities: {
            tools: {},
          },
          serverInfo: {
            name: "Token Metrics MCP Server",
            version: "1.0.0",
          },
        };

        return {
          jsonrpc: "2.0",
          id: request.id,
          result,
        };
      } else if (request.method === "tools/list") {
        const result = {
          tools: AVAILABLE_TOOLS.map((tool) => tool.getToolDefinition()),
        };

        return {
          jsonrpc: "2.0",
          id: request.id,
          result,
        };
      } else if (request.method === "tools/call") {
        if (!apiKey) {
          return {
            jsonrpc: "2.0",
            id: request.id,
            error: {
              code: -32600,
              message: "API key required. Please provide x-api-key header.",
            },
          };
        }

        const { name, arguments: args } = request.params || {};

        if (!name) {
          return {
            jsonrpc: "2.0",
            id: request.id,
            error: {
              code: -32602,
              message: "Missing required parameter: name",
            },
          };
        }

        const tool = AVAILABLE_TOOLS.find(
          (t) => t.getToolDefinition().name === name,
        );

        if (!tool) {
          return {
            jsonrpc: "2.0",
            id: request.id,
            error: {
              code: -32601,
              message: `Unknown tool: ${name}`,
            },
          };
        }

        const toolClass = Object.getPrototypeOf(tool).constructor;
        const toolInstance = new toolClass(apiKey);

        const result = await toolInstance.execute(args || {});

        return {
          jsonrpc: "2.0",
          id: request.id,
          result,
        };
      } else {
        return {
          jsonrpc: "2.0",
          id: request.id,
          error: {
            code: -32601,
            message: `Method not found: ${request.method}`,
          },
        };
      }
    } catch (error) {
      return {
        jsonrpc: "2.0",
        id: request.id,
        error: {
          code: -32603,
          message: error instanceof Error ? error.message : "Internal error",
        },
      };
    }
  }

  private isValidJSONRPCRequest(obj: any): obj is JSONRPCRequest {
    return (
      obj &&
      typeof obj === "object" &&
      obj.jsonrpc === "2.0" &&
      typeof obj.method === "string" &&
      (obj.id === null ||
        typeof obj.id === "string" ||
        typeof obj.id === "number")
    );
  }

  private shouldStream(request: JSONRPCRequest): boolean {
    return request.method === "tools/call";
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
          `Token Metrics MCP HTTP Server running on http://0.0.0.0:${this.port}`,
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

main().catch((error: unknown) => {
  console.error(
    "Failed to start server:",
    error instanceof Error ? error.message : String(error),
  );
  process.exit(1);
});
