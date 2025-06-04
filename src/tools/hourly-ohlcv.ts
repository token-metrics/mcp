import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { BaseApiTool, TokenMetricsBaseResponse } from "./base-api-tool.js";

interface TokenMetricsResponse extends TokenMetricsBaseResponse {
  data: Array<{
    TOKEN_ID: number;
    TOKEN_NAME: string;
    TOKEN_SYMBOL: string;
    TIMESTAMP: string;
    OPEN: number;
    HIGH: number;
    LOW: number;
    CLOSE: number;
    VOLUME: number;
  }>;
}
interface HourlyOHLCVInput {
  token_id?: string;
  symbol?: string;
  token_name?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  page?: number;
}

export class HourlyOHLCVTool extends BaseApiTool {
  getToolDefinition(): Tool {
    return {
      name: "get_tokens_hourly_ohlcv",
      description:
        "Fetch hourly OHLCV (Open, High, Low, Close, Volume) data for token(s) for a specific date or date range from Token Metrics API.",
      inputSchema: {
        type: "object",
        properties: {
          token_id: {
            type: "string",
            description: "Comma-separated string of token IDs (e.g., '1,2,3')",
          },
          token_name: {
            type: "string",
            description:
              "Comma Separated Crypto Asset Names (e.g., Bitcoin, Ethereum)",
          },
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
          symbol: {
            type: "string",
            description:
              "Comma-separated string of token symbols (e.g., 'BTC,ETH,ADA')",
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
        required: [],
      },
    } as Tool;
  }

  protected async performApiRequest(
    input: HourlyOHLCVInput,
  ): Promise<TokenMetricsResponse> {
    this.validateApiKey();
    const params = this.buildParams(input);

    return (await this.makeApiRequest(
      "/hourly-ohlcv",
      params,
    )) as TokenMetricsResponse;
  }
}
