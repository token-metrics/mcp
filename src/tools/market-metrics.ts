import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { BaseApiTool, TokenMetricsBaseResponse } from "./base-api-tool.js";

interface TokenMetricsResponse extends TokenMetricsBaseResponse {
  data: Array<{
    DATE: string;
    TOTAL_CRYPTO_MCAP: number;
    TM_GRADE_PERC_HIGH_COINS: number;
    TM_GRADE_SIGNAL: number;
    LAST_TM_GRADE_SIGNAL: number;
  }>;
}
interface MarketMetricsInput {
  startDate?: string;
  endDate?: string;
  limit?: number;
  page?: number;
  api_key?: string;
}

export class MarketMetricsTool extends BaseApiTool {
  getToolDefinition(): Tool {
    return {
      name: "get_market_metrics",
      description:
        "Fetch Market Analytics from Token Metrics API. They provide insight into the full Crypto Market, including the Bullish/Bearish Market indicator for a specific date or date range.",
      inputSchema: {
        type: "object",
        properties: {
          startDate: {
            type: "string",
            description:
              "Start Date accepts date as a string - YYYY-MM-DD format. Example: 2023-10-01",
          },
          endDate: {
            type: "string",
            description:
              "End Date accepts date as a string - YYYY-MM-DD format. Example: 2023-10-10",
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
          api_key: {
            type: "string",
            description:
              "Your Token Metrics API key (required if not set as environment variable)",
          },
        },
        required: [],
      },
    } as Tool;
  }

  protected async performApiRequest(
    input: MarketMetricsInput,
  ): Promise<TokenMetricsResponse> {
    const activeApiKey = this.validateApiKey(input.api_key);
    const params = this.buildParams(input);

    return (await this.makeApiRequest(
      "/market-metrics",
      params,
      activeApiKey,
    )) as TokenMetricsResponse;
  }
}
