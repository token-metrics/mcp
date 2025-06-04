import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { BaseApiTool, TokenMetricsBaseResponse } from "./base-api-tool.js";

interface TokenMetricsResponse extends TokenMetricsBaseResponse {
  data: Array<{
    TOKEN_ID: number;
    TOKEN_NAME: string;
    TOKEN_SYMBOL: string;
    COIN: string;
    CG_ID: string;
    WEIGHT: number;
    MARKET_CAP: number;
    PRICE: number;
    CURRENT_ROI: number;
    TRADER_GRADE: number;
    TRADER_GRADE_CHANGE_24H: number;
    ICON: string;
    DATE: string;
  }>;
}
interface IndicesHoldingsInput {
  id: string;
}

export class IndicesHoldingsTool extends BaseApiTool {
  getToolDefinition(): Tool {
    return {
      name: "get_indices_holdings",
      description:
        "Fetch the current holdings of the given Index, along with their respective weight in percentage from Token Metrics API.",
      inputSchema: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Id of the index. Example: 1",
          },
        },
        required: ["id"],
      },
    } as Tool;
  }

  protected async performApiRequest(
    input: IndicesHoldingsInput,
  ): Promise<TokenMetricsResponse> {
    this.validateApiKey();
    const params = this.buildParams(input);

    return (await this.makeApiRequest(
      "/indices-holdings",
      params,
    )) as TokenMetricsResponse;
  }
}
