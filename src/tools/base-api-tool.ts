import axios from "axios";
import { BaseTool, ToolResponse } from "./types.js";

export interface TokenMetricsBaseResponse {
  success: boolean;
  message: string;
  length: number;
  data: any[];
}

export abstract class BaseApiTool implements BaseTool {
  protected readonly apiBaseUrl = "https://api.tokenmetrics.com/v2";
  protected readonly apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.TOKEN_METRICS_API_KEY || "";
  }

  abstract getToolDefinition(): any;

  async execute(args: any): Promise<ToolResponse | any> {
    try {
      const result = await this.performApiRequest(args);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error fetching data: ${
              error instanceof Error ? error.message : String(error)
            }`,
          },
        ],
        isError: true,
      };
    }
  }

  protected abstract performApiRequest(
    input: any,
  ): Promise<TokenMetricsBaseResponse>;

  protected validateApiKey(): string {
    if (!this.apiKey) {
      const errorMsg =
        "API key is required. Provide it as TOKEN_METRICS_API_KEY environment variable.";
      console.error(`[ERROR] ${errorMsg}`);
      throw new Error(errorMsg);
    }

    return this.apiKey;
  }

  protected async makeApiRequest(
    endpoint: string,
    params: Record<string, string | number>,
  ): Promise<TokenMetricsBaseResponse> {
    try {
      const response = await axios.get(`${this.apiBaseUrl}${endpoint}`, {
        params,
        headers: {
          Accept: "application/json",
          "x-api-key": this.apiKey,
        },
        timeout: 30000,
      });

      return response.data as TokenMetricsBaseResponse;
    } catch (error) {
      console.error(`[ERROR] API request failed:`, error);

      if (axios.isAxiosError(error)) {
        if (error.response) {
          const errorMsg = `API Error (${
            error.response.status
          }): ${JSON.stringify(error.response.data)}`;
          console.error(`[ERROR] ${errorMsg}`);
          throw new Error(errorMsg);
        } else if (error.request) {
          const errorMsg = "Network error: Unable to reach Token Metrics API";
          console.error(`[ERROR] ${errorMsg}`);
          throw new Error(errorMsg);
        }
      }
      const errorMsg = `Request failed: ${
        error instanceof Error ? error.message : String(error)
      }`;
      console.error(`[ERROR] ${errorMsg}`);
      throw new Error(errorMsg);
    }
  }

  protected buildParams(
    input: Record<string, any>,
    excludeKeys: string[] = [],
  ): Record<string, string | number> {
    const params: Record<string, string | number> = {};

    Object.keys(input).forEach((key) => {
      if (
        !excludeKeys.includes(key) &&
        input[key] !== undefined &&
        input[key] !== null
      ) {
        params[key] = input[key];
      }
    });

    return params;
  }
}
