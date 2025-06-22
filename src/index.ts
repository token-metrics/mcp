import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  CallToolRequest,
} from "@modelcontextprotocol/sdk/types.js";
import { AVAILABLE_TOOLS } from "./tools/index.js";

export class TokenMetricsMCPServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: "Token Metrics MCP Server",
        version: "1.3.0",
      },
      {
        capabilities: {
          tools: {},
        },
      },
    );

    this.setupToolHandlers();
  }

  private setupToolHandlers(): void {
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

        return await tool.execute(args);
      },
    );
  }

  async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);

    console.error("Token Metrics MCP Server running on stdio");
  }
}
