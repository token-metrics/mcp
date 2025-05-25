import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { BaseApiTool, TokenMetricsBaseResponse } from "./base-api-tool.js";

// Define the API response interface
interface TokenMetricsResponse extends TokenMetricsBaseResponse {
  data: Array<{
    TOKEN_ID: number;
    TOKEN_NAME: string;
    TOKEN_SYMBOL: string;
    TM_LINK: string;
  }>;
}

// Define the tool input interface
interface TokenDataInput {
  token_id?: string;
  token_name?: string;
  symbol?: string;
  category?: string;
  exchange?: string;
  blockchain_address?: string;
  limit?: number;
  page?: number;
  api_key?: string;
}

export class TokenDataTool extends BaseApiTool {
  getToolDefinition(): Tool {
    return {
      name: "get_token_data",
      description:
        "Fetch token data from Token Metrics API. Provide either token_id or symbol (or both) along with optional date range. For hosted servers, include your api_key parameter.",
      inputSchema: {
        type: "object",
        properties: {
          token_id: {
            type: "string",
            description: "Comma-separated string of token IDs (e.g., '1,2,3')",
          },
          token_name: {
            type: "string",
            description:
              "Comma Separated Crypto Asset Names (e.g., Bitcoin, Ethereum)",
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
          blockchain_address: {
            type: "string",
            description:
              "Use this parameter to search tokens through specific blockchains and contract addresses. Input the blockchain name followed by a colon and then the contract address. Example: binance-smart-chain:0x57185189118c7e786cafd5c71f35b16012fa95ad",
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
        required: [],
      },
    } as Tool;
  }

  protected async performApiRequest(
    input: TokenDataInput,
  ): Promise<TokenMetricsResponse> {
    const activeApiKey = this.validateApiKey(input.api_key);
    const params = this.buildParams(input);

    return (await this.makeApiRequest(
      "/tokens",
      params,
      activeApiKey,
    )) as TokenMetricsResponse;
  }
}
