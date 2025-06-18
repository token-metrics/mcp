import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { BaseApiTool, TokenMetricsBaseResponse } from "./base-api-tool.js";
import search from "../utils/search.js";

interface SearchResult {
  type: string;
  text: string;
}

interface SearchResponse {
  content: SearchResult[];
}

interface SearchInput {
  query: string;
}

interface ParsedQuery {
  endpoint: string;
  params: Record<string, string>;
}

export class SearchTool extends BaseApiTool {
  getToolDefinition(): Tool {
    return {
      name: "search",
      description: search.description,
      inputSchema: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Search query.",
          },
        },
        required: ["query"],
      },
      outputSchema: {
        type: "object",
        properties: {
          content: {
            type: "array",
            items: {
              type: "object",
              properties: {
                type: {
                  type: "string",
                  description: "Type of the resource.",
                },
                text: {
                  type: "object",
                  description: "JSON string object containing the results.",
                },
              },
            },
          },
        },
        required: ["content"],
      },
    } as Tool;
  }

  async execute(args: SearchInput) {
    try {
      const results = await this.performSearch(args.query);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(results, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Error performing search: ${
              error instanceof Error ? error.message : String(error)
            }`,
          },
        ],
        isError: true,
      };
    }
  }

  private async performSearch(
    query: string,
  ): Promise<TokenMetricsBaseResponse> {
    this.validateApiKey();

    const { endpoint, params } = this.parseQuery(query);

    const endpointData = (search.endpointsData as any)[endpoint];
    if (!endpointData) throw new Error(`Unknown endpoint: ${endpoint}`);

    return await this.makeApiRequest(endpointData.path, params);
  }

  private parseQuery(query: string): ParsedQuery {
    const q = query.trim();
    if (!q) {
      throw new Error("empty query string");
    }

    const parts = q.split(/\s+/);
    let endpointKey: string;
    let tokens: string[];

    if (parts[0].startsWith("endpoint:")) {
      const colonIndex = parts[0].indexOf(":");
      endpointKey = parts[0].substring(colonIndex + 1);
      tokens = parts.slice(1);
    } else {
      endpointKey = "tokens";
      tokens = parts;
    }

    if (!(endpointKey in search.endpointsData))
      throw new Error(`unknown endpoint '${endpointKey}'`);

    const params: Record<string, string> = {};
    for (const tok of tokens) {
      if (!tok.includes(":"))
        throw new Error(`malformed token '${tok}' – expected field:value`);

      const colonIndex = tok.indexOf(":");
      const field = tok.substring(0, colonIndex);
      const value = tok.substring(colonIndex + 1);
      params[field] = value;
    }

    return { endpoint: endpointKey, params };
  }

  protected async performApiRequest(
    input: SearchInput,
  ): Promise<TokenMetricsBaseResponse> {
    // This method is required by the base class but not used directly for search
    throw new Error("Use performSearch method instead");
  }
}
