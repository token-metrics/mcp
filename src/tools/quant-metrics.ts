import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { BaseApiTool, TokenMetricsBaseResponse } from "./base-api-tool.js";

interface TokenMetricsResponse extends TokenMetricsBaseResponse {
  data: Array<{
    TOKEN_ID: number;
    TOKEN_NAME: string;
    TOKEN_SYMBOL: string;
    DATE: string;
    VOLATILITY: number;
    ALL_TIME_RETURN: number;
    CAGR: number;
    SHARPE: number;
    SORTINO: number;
    MAX_DRAWDOWN: number;
    SKEW: number;
    TAIL_RATIO: number;
    RISK_REWARD_RATIO: number;
    PROFIT_FACTOR: number;
    KURTOSIS: number;
    DAILY_VALUE_AT_RISK: number;
    DAILY_RETURN_AVG: number;
    DAILY_RETURN_STD: number;
  }>;
}
interface QuantMetricsInput {
  token_id?: string;
  symbol?: string;
  category?: string;
  exchange?: string;
  marketcap?: string;
  fdv?: string;
  volume?: string;
  limit?: number;
  page?: number;
  api_key?: string;
}

export class QuantMetricsTool extends BaseApiTool {
  getToolDefinition(): Tool {
    return {
      name: "get_tokens_quant_metrics",
      description:
        "Fetch the latest quantitative metrics for token(s). Note that Token Metrics pricing data starts on 2019-01-01 for most tokens. More historical data will be available soon.",
      inputSchema: {
        type: "object",
        properties: {
          token_id: {
            type: "string",
            description: "Comma-separated string of token IDs (e.g., '1,2,3')",
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
          marketcap: {
            type: "string",
            description:
              "Minimum MarketCap in $ (USD) of the token. Example: 100",
          },
          fdv: {
            type: "string",
            description:
              "Minimum fully diluted valuation in $ (USD) of the token. Example: 100",
          },
          volume: {
            type: "string",
            description:
              "Minimum 24h trading volume in $ (USD) of the token. Example: 100",
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
    input: QuantMetricsInput,
  ): Promise<TokenMetricsResponse> {
    const activeApiKey = this.validateApiKey(input.api_key);
    const params = this.buildParams(input);

    return (await this.makeApiRequest(
      "/quantmetrics",
      params,
      activeApiKey,
    )) as TokenMetricsResponse;
  }
}
