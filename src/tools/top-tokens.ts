import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { BaseApiTool, TokenMetricsBaseResponse } from "./base-api-tool.js";

interface TokenMetricsResponse extends TokenMetricsBaseResponse {
  data: Array<{
    TOKEN_ID: number;
    TOKEN_NAME: string;
    TOKEN_SYMBOL: string;
    EXCHANGE_LIST: any[];
    CATEGORY_LIST: any[];
    TM_LINK: string;
  }>;
}
interface TopTokensInput {
  top_k: number;
  page: number;
}

export class TopTokensTool extends BaseApiTool {
  getToolDefinition(): Tool {
    return {
      name: "get_top_tokens_by_market_cap",
      description:
        "Fetch the the list of coins with top market cap from Token Metrics API.",
      inputSchema: {
        type: "object",
        properties: {
          top_k: {
            type: "number",
            description:
              "Specifies the number of top cryptocurrencies to retrieve, based on their market capitalization. Default is 50. Maximum is 100. Exmaple: 100",
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
    input: TopTokensInput,
  ): Promise<TokenMetricsResponse> {
    this.validateApiKey();
    const params = this.buildParams(input);

    return (await this.makeApiRequest(
      "/top-market-cap-tokens",
      params,
    )) as TokenMetricsResponse;
  }
}
