import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { BaseApiTool, TokenMetricsBaseResponse } from "./base-api-tool.js";

interface TokenMetricsResponse extends TokenMetricsBaseResponse {
  data: Array<{
    TOKEN_ID: number;
    TOKEN_SYMBOL: string;
    TOKEN_NAME: string;
    INVESTMENT_ANALYSIS_POINTER: string;
    INVESTMENT_ANALYSIS: string;
    DEEP_DIVE: string;
    CODE_REVIEW: string;
  }>;
}
interface AiReportInput {
  token_id: string;
  symbol: string;
  limit: number;
  page: number;
}

export class AiReportTool extends BaseApiTool {
  getToolDefinition(): Tool {
    return {
      name: "get_tokens_ai_report",
      description:
        "Fetch token(s) AI-generated reports providing comprehensive analyses of cryptocurrency tokens, including deep dives, investment analyses, and code reviews from Token Metrics API.",
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
    input: AiReportInput,
  ): Promise<TokenMetricsResponse> {
    this.validateApiKey();
    const params = this.buildParams(input);

    return (await this.makeApiRequest(
      "/ai-reports",
      params,
    )) as TokenMetricsResponse;
  }
}
