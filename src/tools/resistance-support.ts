import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { BaseApiTool, TokenMetricsBaseResponse } from "./base-api-tool.js";

interface TokenMetricsResponse extends TokenMetricsBaseResponse {
  data: Array<{
    TOKEN_ID: number;
    TOKEN_NAME: string;
    TOKEN_SYMBOL: string;
    DATE: string;
    HISTORICAL_RESISTANCE_SUPPORT_LEVELS: any[];
  }>;
}

interface ResistanceSupportInput {
  token_id: string;
  symbol: string;
  limit: number;
  page: number;
  api_key?: string;
}

export class ResistanceSupportTool extends BaseApiTool {
  getToolDefinition(): Tool {
    return {
      name: "get_tokens_resistance_and_support",
      description:
        "Fetch token(s) historical levels of resistance and support from Token Metrics API. Provide token_id or symbol.",
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
          api_key: {
            type: "string",
            description:
              "Your Token Metrics API key (required if not set as environment variable)",
          },
        },
        required: ["token_id", "symbol"],
      },
    } as Tool;
  }

  protected async performApiRequest(
    input: ResistanceSupportInput,
  ): Promise<TokenMetricsResponse> {
    const activeApiKey = this.validateApiKey(input.api_key);
    const params = this.buildParams(input);

    return (await this.makeApiRequest(
      "/resistance-support",
      params,
      activeApiKey,
    )) as TokenMetricsResponse;
  }
}
