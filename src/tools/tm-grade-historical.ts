import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { BaseApiTool, TokenMetricsBaseResponse } from "./base-api-tool.js";

interface TokenMetricsResponse extends TokenMetricsBaseResponse {
  data: Array<{
    TOKEN_ID: number;
    TOKEN_NAME: string;
    TOKEN_SYMBOL: string;
    FUNDAMENTAL_GRADE: string;
    TM_GRADE: string;
    TM_GRADE_24h_PCT_CHANGE: string;
    TM_TRADER_GRADE_24H_CHANGE: string;
    FUNDAMENTAL_GRADE_CLASS: string;
    TM_GRADE_SIGNAL: string;
    MOMENTUM: string;
    DATE: string;
  }>;
}
interface TokenTmGradeHistoricalInput {
  token_id: number;
  startDate?: string;
  endDate?: string;
  limit?: number;
  page?: number;
}

export class TokenTmGradeHistoricalTool extends BaseApiTool {
  getToolDefinition(): Tool {
    return {
      name: "get_token_tm_grade_historical",
      description:
        "Fetch token's historical TM Grade and Fundamental Grade data over a specified date range, including signals and momentum trends from Token Metrics API.",
      inputSchema: {
        type: "object",
        properties: {
          token_id: {
            type: "number",
            description: "Token ID. Example: 3375",
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
        required: ["token_id"],
      },
    } as Tool;
  }

  protected async performApiRequest(
    input: TokenTmGradeHistoricalInput,
  ): Promise<TokenMetricsResponse> {
    this.validateApiKey();
    const params = this.buildParams(input);

    return (await this.makeApiRequest(
      "/tm-grade-history",
      params,
    )) as TokenMetricsResponse;
  }
}
