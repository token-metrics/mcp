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
      // outputSchema: {
      //   type: "object",
      //   properties: {
      //     id: {
      //       type: "string",
      //       description: "ID of the resource.",
      //     },
      //     title: {
      //       type: "string",
      //       description: "Title or headline of the fetched resource.",
      //     },
      //     text: {
      //       type: "string",
      //       description: "Complete textual content of the resource.",
      //     },
      //     url: {
      //       type: ["string", "null"],
      //       description:
      //         "URL of the resource. Optional but needed for citations to work.",
      //     },
      //     metadata: {
      //       type: ["object", "null"],
      //       additionalProperties: {
      //         type: "string",
      //       },
      //       description: "Optional metadata providing additional context.",
      //     },
      //   },
      //   required: ["id", "title", "text"],
      // },
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
