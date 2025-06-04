import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { BaseApiTool, TokenMetricsBaseResponse } from "./base-api-tool.js";

interface TokenMetricsResponse extends TokenMetricsBaseResponse {
  data: Array<{
    ID: number;
    DATE: string;
    INDEX_CUMULATIVE_ROI: number;
    MARKET_CAP: number;
    VOLUME: number;
    FDV: number;
  }>;
}
interface IndicesPerformanceInput {
  id: number;
  startDate: string;
  endDate: string;
  limit: number;
  page: number;
}

export class IndicesPerformanceTool extends BaseApiTool {
  getToolDefinition(): Tool {
    return {
      name: "get_indices_performance",
      description:
        "Fetch historical performance data for a given index, including cumulative return on investment (ROI) over time from Token Metrics API. This data is useful for analyzing index trends and evaluating investment performance.",
      inputSchema: {
        type: "object",
        properties: {
          id: {
            type: "number",
            description: "Id of the index. Example: 1",
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
        required: ["id"],
      },
    } as Tool;
  }

  protected async performApiRequest(
    input: IndicesPerformanceInput,
  ): Promise<TokenMetricsResponse> {
    this.validateApiKey();
    const params = this.buildParams(input);

    return (await this.makeApiRequest(
      "/indices-performance",
      params,
    )) as TokenMetricsResponse;
  }
}
