import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { BaseApiTool, TokenMetricsBaseResponse } from "./base-api-tool.js";

interface TokenMetricsResponse extends TokenMetricsBaseResponse {
  data: Array<{
    DATETIME: string;
    MARKET_SENTIMENT_GRADE: number;
    MARKET_SENTIMENT_LABEL: string;
    NEWS_SENTIMENT_GRADE: number;
    NEWS_SENTIMENT_LABEL: string;
    NEWS_SUMMARY: string;
    REDDIT_SENTIMENT_GRADE: number;
    REDDIT_SENTIMENT_LABEL: string;
    REDDIT_SUMMARY: string;
    TWITTER_SENTIMENT_GRADE: number;
    TWITTER_SENTIMENT_LABEL: string;
    TWITTER_SUMMARY: string;
  }>;
}
interface SentimentInput {
  api_key?: string;
}

export class SentimentTool extends BaseApiTool {
  getToolDefinition(): Tool {
    return {
      name: "get_sentiment",
      description:
        "Fetch the hourly sentiment score for Twitter, Reddit, and all the News, including quick summary of what happened from Token Metrics API.",
      inputSchema: {
        type: "object",
        properties: {
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
    input: SentimentInput,
  ): Promise<TokenMetricsResponse> {
    const activeApiKey = this.validateApiKey(input.api_key);
    const params = this.buildParams(input);

    return (await this.makeApiRequest(
      "/sentiments",
      params,
      activeApiKey,
    )) as TokenMetricsResponse;
  }
}
