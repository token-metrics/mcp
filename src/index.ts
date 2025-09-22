import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  CallToolRequest,
} from "@modelcontextprotocol/sdk/types.js";
import { AVAILABLE_TOOLS } from "./tools/index.js";

export class TokenMetricsMCPServer {
  readonly server: Server;

  constructor(apiKey?: string) {
    this.server = new Server(
      {
        name: "Token Metrics MCP Server",
        version: "1.5.0",
      },
      {
        capabilities: {
          tools: {},
        },
      },
    );

    this.setupToolHandlers(apiKey);
  }

  private setupToolHandlers(apiKey?: string): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: AVAILABLE_TOOLS.map((tool) => tool.getToolDefinition()),
      };
    });

    this.server.setRequestHandler(
      CallToolRequestSchema,
      async (request: CallToolRequest) => {
        const { name, arguments: args } = request.params;

        const tool = AVAILABLE_TOOLS.find(
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
  }

  async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);

    console.error("Token Metrics MCP Server running on stdio");
  }
}

export default function createServer({
  config,
}: {
  config: z.infer<typeof configSchema>;
}) {
  const server = new TokenMetricsMCPServer(config.apiKey);
  return server.server;
}

export const configSchema = z.object({
  apiKey: z.string().describe("Your Token Metrics API Key"),
});
