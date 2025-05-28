import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { BaseApiTool, TokenMetricsBaseResponse } from "./base-api-tool.js";

interface TokenMetricsResponse extends TokenMetricsBaseResponse {
  data: Array<{
    TOKEN_ID: number;
    TOKEN_NAME: string;
    TOKEN_SYMBOL: string;
    DATE: string;
    TOP_CORRELATION: any[];
  }>;
}
interface CorrelationInput {
  token_id?: string;
  token_name?: string;
  symbol?: string;
  category?: string;
  exchange?: string;
  limit?: number;
  page?: number;
  api_key?: string;
}

export class CorrelationTool extends BaseApiTool {
  getToolDefinition(): Tool {
    return {
      name: "get_tokens_correlation",
      description:
        "Fetch token(s) Top 10 and Bottom 10 correlated tokens from the top 100 market cap tokens from Token Metrics API.",
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
          symbol: {
            type: "string",
            description:
              "Comma-separated string of token symbols (e.g., 'BTC,ETH,ADA')",
          },
          category: {
            type: "string",
            description:
              "Comma Separated category name. Example: yield farming,defi",
          },
          exchange: {
            type: "string",
            description: "Comma Separated exchange name. Example: binance,gate",
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
    input: CorrelationInput,
  ): Promise<TokenMetricsResponse> {
    const activeApiKey = this.validateApiKey(input.api_key);
    const params = this.buildParams(input);

    return (await this.makeApiRequest(
      "/correlation",
      params,
      activeApiKey,
    )) as TokenMetricsResponse;
  }
}
