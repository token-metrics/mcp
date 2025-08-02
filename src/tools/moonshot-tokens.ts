import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { BaseApiTool, TokenMetricsBaseResponse } from "./base-api-tool.js";

interface TokenMetricsResponse extends TokenMetricsBaseResponse {
  data: Array<{
    LAST_TRADING_SIGNAL_TIME: string;
    TM_TRADER_GRADE: string;
    TM_TRADER_GRADE_24H_PCT_CHANGE: string;
    PRICE_CHANGE_PERCENTAGE_7D_IN_CURRENCY: string;
    MARKET_CAP: string;
    VOLUME_24H: string;
    MOONSHOT_END_AT: string;
    MOONSHOT_AT: string;
    MOONSHOT_ROI: number;
    TOKEN_NAME: string;
    TOKEN_SYMBOL: string;
  }>;
}
interface MoonshotTokensInput {
  type?: string;
  limit?: number;
  page?: number;
}

export class MoonshotTokensTool extends BaseApiTool {
  getToolDefinition(): Tool {
    return {
      name: "get_moonshot_tokens",
      description:
        "Fetch the AI-curated token picks (Moonshots) with high breakout potential based on grades, sentiment, volume, and on-chain data to help users trade smarter and faster from Token Metrics API.",
      inputSchema: {
        type: "object",
        properties: {
          type: {
            type: "string",
            description:
              'Accepts "active" or "past" to fetch respective moonshots. Defaults to "active" if not provided',
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
    input: MoonshotTokensInput,
  ): Promise<TokenMetricsResponse> {
    this.validateApiKey();
    const params = this.buildParams(input);

    return (await this.makeApiRequest(
      "/moonshot-tokens",
      params,
    )) as TokenMetricsResponse;
  }
}
