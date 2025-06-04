import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { BaseApiTool, TokenMetricsBaseResponse } from "./base-api-tool.js";

interface TokenMetricsResponse extends TokenMetricsBaseResponse {
  data: Array<{
    TOKEN_ID: number;
    TOKEN_NAME: string;
    TOKEN_SYMBOL: string;
    DATE: string;
    TM_INVESTOR_GRADE: number;
    TM_INVESTOR_GRADE_7D_PCT_CHANGE: number;
    FUNDAMENTAL_GRADE: number;
    TECHNOLOGY_GRADE: number;
    VALUATION_GRADE: number;
    DEFI_USAGE_SCORE: number | null;
    COMMUNITY_SCORE: number;
    EXCHANGE_SCORE: number;
    VC_SCORE: number | null;
    TOKENOMICS_SCORE: number;
    DEFI_SCANNER_SCORE: number;
    ACTIVITY_SCORE: number;
    SECURITY_SCORE: number;
    REPOSITORY_SCORE: number;
    COLLABORATION_SCORE: number;
  }>;
}
interface TokenInvestorGradeInput {
  token_id?: string;
  startDate?: string;
  endDate?: string;
  symbol?: string;
  category?: string;
  exchange?: string;
  marketcap?: string;
  fdv?: string;
  volume?: string;
  investorGrade?: string;
  limit?: number;
  page?: number;
}

export class TokenInvestorGradeTool extends BaseApiTool {
  getToolDefinition(): Tool {
    return {
      name: "get_tokens_investor_grade",
      description:
        "Fetch token(s) long term grades, including Technology and Fundamental metrics for a specific date or date range from Token Metrics API.",
      inputSchema: {
        type: "object",
        properties: {
          token_id: {
            type: "string",
            description: "Comma-separated string of token IDs (e.g., '1,2,3')",
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
          investorGrade: {
            type: "string",
            description: "Minimum TM Investor Grade of the token. Example: 17",
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
    input: TokenInvestorGradeInput,
  ): Promise<TokenMetricsResponse> {
    this.validateApiKey();
    const params = this.buildParams(input);

    return (await this.makeApiRequest(
      "/investor-grades",
      params,
    )) as TokenMetricsResponse;
  }
}
