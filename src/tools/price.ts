import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { BaseApiTool, TokenMetricsBaseResponse } from "./base-api-tool.js";

interface TokenMetricsResponse extends TokenMetricsBaseResponse {
  data: Array<{
    TOKEN_ID: number;
    TOKEN_NAME: string;
    TOKEN_SYMBOL: string;
    CURRENT_PRICE: number;
  }>;
}

interface PriceInput {
  token_id: string;
  api_key?: string;
}

export class PriceTool extends BaseApiTool {
  getToolDefinition(): Tool {
    return {
      name: "get_token_price",
      description:
        "Fetch token price from Token Metrics API. Provide token_id. For hosted servers, include your api_key parameter.",
      inputSchema: {
        type: "object",
        properties: {
          token_id: {
            type: "string",
            description: "Comma-separated string of token IDs (e.g., '1,2,3')",
          },
          api_key: {
            type: "string",
            description:
              "Your Token Metrics API key (required if not set as environment variable)",
          },
        },
        required: ["token_id"],
      },
    } as Tool;
  }

  protected async performApiRequest(
    input: PriceInput,
  ): Promise<TokenMetricsResponse> {
    const activeApiKey = this.validateApiKey(input.api_key);
    const params = this.buildParams(input);

    return (await this.makeApiRequest(
      "/price",
      params,
      activeApiKey,
    )) as TokenMetricsResponse;
  }
}
