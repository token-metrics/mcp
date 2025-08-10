import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { BaseApiTool, TokenMetricsBaseResponse } from "./base-api-tool.js";

interface TokenMetricsResponse extends TokenMetricsBaseResponse {
  data: Array<{
    TOKEN_ID: number;
    TOKEN_NAME: string;
    TOKEN_SYMBOL: string;
    DATE: string;
    TECHNOLOGY_GRADE: number;
    ACTIVITY_SCORE: number;
    SECURITY_SCORE: number;
    REPOSITORY_SCORE: number;
    COLLABORATION_SCORE: number;
    DEFI_SCANNER_SCORE: number;
  }>;
}
interface TokenTechnologyGradeInput {
  token_id: number;
  symbol?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  page?: number;
}

export class TokenTechnologyGradeTool extends BaseApiTool {
  getToolDefinition(): Tool {
    return {
      name: "get_token_technology_grade",
      description:
        "Fetch token's latest Technology Grade, reflecting its tech strength and innovation ranking compared to other tokens from Token Metrics API.",
      inputSchema: {
        type: "object",
        properties: {
          token_id: {
            type: "number",
            description: "Token ID. Example: 3375",
          },
          symbol: {
            type: "string",
            description: "Token Symbol. Example: BTC",
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
        required: [],
      },
    } as Tool;
  }

  protected async performApiRequest(
    input: TokenTechnologyGradeInput,
  ): Promise<TokenMetricsResponse> {
    this.validateApiKey();
    const params = this.buildParams(input);

    return (await this.makeApiRequest(
      "/technology-grade",
      params,
    )) as TokenMetricsResponse;
  }
}
