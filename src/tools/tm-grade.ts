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
  }>;
}
interface TokenTmGradeInput {
  token_id: number;
}

export class TokenTmGradeTool extends BaseApiTool {
  getToolDefinition(): Tool {
    return {
      name: "get_token_tm_grade",
      description:
        "Fetch token's latest TM Grade and Fundamental Grade insights, including signals, momentum, and 24‑hour percentage changes from Token Metrics API.",
      inputSchema: {
        type: "object",
        properties: {
          token_id: {
            type: "number",
            description: "Token ID. Example: 3375",
          },
        },
        required: ["token_id"],
      },
    } as Tool;
  }

  protected async performApiRequest(
    input: TokenTmGradeInput,
  ): Promise<TokenMetricsResponse> {
    this.validateApiKey();
    const params = this.buildParams(input);

    return (await this.makeApiRequest(
      "/tm-grade",
      params,
    )) as TokenMetricsResponse;
  }
}
