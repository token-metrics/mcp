import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { BaseApiTool, TokenMetricsBaseResponse } from "./base-api-tool.js";

interface TokenMetricsResponse extends TokenMetricsBaseResponse {
  data: Array<{
    INVESTOR_NAME: string;
    INVESTOR_WEBSITE: string;
    INVESTOR_TWITTER: string;
    ROUND_COUNT: number;
    ROI_AVERAGE: number;
    ROI_MEDIAN: number;
  }>;
}
interface CryptoInvestorInput {
  limit: number;
  page: number;
}

export class CryptoInvestorTool extends BaseApiTool {
  getToolDefinition(): Tool {
    return {
      name: "get_crypto_investors",
      description:
        "Fetch the latest list of crypto investors and their scores from Token Metrics API.",
      inputSchema: {
        type: "object",
        properties: {
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
    input: CryptoInvestorInput,
  ): Promise<TokenMetricsResponse> {
    this.validateApiKey();
    const params = this.buildParams(input);

    return (await this.makeApiRequest(
      "/crypto-investors",
      params,
    )) as TokenMetricsResponse;
  }
}
