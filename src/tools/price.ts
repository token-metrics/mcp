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
}

export class PriceTool extends BaseApiTool {
  getToolDefinition(): Tool {
    return {
      name: "get_tokens_price",
      description:
        "Fetch token(s) price from Token Metrics API. Provide token_id.",
      inputSchema: {
        type: "object",
        properties: {
          token_id: {
            type: "string",
            description: "Comma-separated string of token IDs (e.g., '1,2,3')",
          },
        },
        required: ["token_id"],
      },
    } as Tool;
  }

  protected async performApiRequest(
    input: PriceInput,
  ): Promise<TokenMetricsResponse> {
    this.validateApiKey();
    const params = this.buildParams(input);

    return (await this.makeApiRequest(
      "/price",
      params,
    )) as TokenMetricsResponse;
  }
}
