import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { BaseApiTool, TokenMetricsBaseResponse } from "./base-api-tool.js";

interface TokenMetricsResponse extends TokenMetricsBaseResponse {
  data: Array<{
    ID: number;
    NAME: string;
    TICKER: string;
    PRICE: number;
    COINS: number;
    "24H": number;
    "7D": number;
    "1M": number;
    "24H_VOLUME": number;
    INDEX_GRADE: number;
    ALL_TIME: number;
    MARKET_CAP: number;
    TOP_GAINERS_ICONS: Record<string, any>;
  }>;
}
interface IndicesInput {
  indicesType: string;
  limit: number;
  page: number;
}

export class IndicesTool extends BaseApiTool {
  getToolDefinition(): Tool {
    return {
      name: "get_indices",
      description:
        "Fetch active and passive crypto indices with performance and market data from Token Metrics API.",
      inputSchema: {
        type: "object",
        properties: {
          indicesType: {
            type: "string",
            description:
              'Filter to return indices by type: "active" for actively managed, "passive" for passively managed.',
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
    input: IndicesInput,
  ): Promise<TokenMetricsResponse> {
    this.validateApiKey();
    const params = this.buildParams(input);

    return (await this.makeApiRequest(
      "/indices",
      params,
    )) as TokenMetricsResponse;
  }
}
