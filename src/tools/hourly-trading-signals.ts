import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { BaseApiTool, TokenMetricsBaseResponse } from "./base-api-tool.js";

interface TokenMetricsResponse extends TokenMetricsBaseResponse {
  data: Array<{
    TIMESTAMP: string;
    TOKEN_ID: number;
    TOKEN_NAME: string;
    TOKEN_SYMBOL: string;
    CLOSE: number;
    SIGNAL: string;
    POSITION: string;
  }>;
}
interface TokenHourlyTradingSignalInput {
  token_id?: string;
  limit?: number;
  page?: number;
}

export class TokenHourlyTradingSignalTool extends BaseApiTool {
  getToolDefinition(): Tool {
    return {
      name: "get_tokens_hourly_trading_signals",
      description:
        "Fetch token(s) hourly AI generated trading signals for long and short positions from Token Metrics API.",
      inputSchema: {
        type: "object",
        properties: {
          token_id: {
            type: "string",
            description: "Comma-separated string of token IDs (e.g., '1,2,3')",
          },
          limit: {
            type: "number",
            description:
              "Limit the number of results returned. Default is 50. Maximum is 100.",
          },
          page: {
            type: "number",
            description:
              "Enables pagination and data retrieval control by skipping a specified number of items before fetching data. Page should be a non-negative integer, with 1 indicating the beginning of the dataset.",
          },
        },
        required: ["token_id"],
      },
    } as Tool;
  }

  protected async performApiRequest(
    input: TokenHourlyTradingSignalInput,
  ): Promise<TokenMetricsResponse> {
    this.validateApiKey();
    const params = this.buildParams(input);

    return (await this.makeApiRequest(
      "/hourly-trading-signals",
      params,
    )) as TokenMetricsResponse;
  }
}
