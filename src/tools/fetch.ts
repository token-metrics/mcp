import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { BaseApiTool, TokenMetricsBaseResponse } from "./base-api-tool.js";

interface FetchInput {
  token_id: string;
}

export class FetchTool extends BaseApiTool {
  getToolDefinition(): Tool {
    return {
      name: "fetch",
      description:
        "Fetches detailed token data for a specific token ID from Token Metrics API.",
      inputSchema: {
        type: "object",
        properties: {
          token_id: {
            type: "string",
            description: "Token ID to fetch data for.",
          },
        },
        required: ["token_id"],
      },
    } as Tool;
  }

  async execute(args: FetchInput) {
    try {
      const result = await this.performApiRequest(args);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Error fetching token data: ${
              error instanceof Error ? error.message : String(error)
            }`,
          },
        ],
        isError: true,
      };
    }
  }

  protected async performApiRequest(
    input: FetchInput,
  ): Promise<TokenMetricsBaseResponse> {
    this.validateApiKey();

    const params = {
      token_id: input.token_id,
      limit: 1,
    };

    return await this.makeApiRequest("/tokens", params);
  }
}
