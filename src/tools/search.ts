import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { BaseApiTool, TokenMetricsBaseResponse } from "./base-api-tool.js";
import search from "../utils/search.js";

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
          results: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: {
                  type: "string",
                  description: "ID of the resource.",
                },
                title: {
                  type: "string",
                  description: "Title or headline of the resource.",
                },
                text: {
                  type: "string",
                  description: "Text snippet or summary from the resource.",
                },
                url: {
                  type: ["string", "null"],
                  description:
                    "URL of the resource. Optional but needed for citations to work.",
                },
              },
              required: ["id", "title", "text"],
            },
          },
        },
        required: ["results"],
      },
    } as Tool;
  }

  async executeOpenAI(
    args: SearchInput,
  ): Promise<{ results: { text: string }[] }> {
    try {
      const results = await this.performSearch(args.query);
      return {
        results: [{ text: JSON.stringify(results, null, 2) }],
      };
    } catch (error) {
      return {
        results: [
          {
            text: `Error performing search: ${
              error instanceof Error ? error.message : String(error)
            }`,
          },
        ],
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

    const tokens = this.parseTokens(q);

    let endpointKey: string;
    let paramTokens: string[];

    if (tokens[0].startsWith("endpoint:")) {
      const colonIndex = tokens[0].indexOf(":");
      endpointKey = tokens[0].substring(colonIndex + 1);
      paramTokens = tokens.slice(1);
    } else {
      endpointKey = "tokens";
      paramTokens = tokens;
    }

    if (!(endpointKey in search.endpointsData))
      throw new Error(`unknown endpoint '${endpointKey}'`);

    const params: Record<string, string> = {};
    for (const tok of paramTokens) {
      if (!tok.includes(":"))
        throw new Error(`malformed token '${tok}' – expected field:value`);

      const colonIndex = tok.indexOf(":");
      const field = tok.substring(0, colonIndex);
      let value = tok.substring(colonIndex + 1);

      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      params[field] = value;
    }

    return { endpoint: endpointKey, params };
  }

  private parseTokens(query: string): string[] {
    const tokens: string[] = [];
    let current = "";
    let inQuotes = false;
    let quoteChar = "";

    for (let i = 0; i < query.length; i++) {
      const char = query[i];

      if (!inQuotes && (char === '"' || char === "'")) {
        inQuotes = true;
        quoteChar = char;
        current += char;
      } else if (inQuotes && char === quoteChar) {
        inQuotes = false;
        current += char;
        quoteChar = "";
      } else if (!inQuotes && /\s/.test(char)) {
        if (current.trim()) {
          tokens.push(current.trim());
          current = "";
        }
      } else {
        current += char;
      }
    }

    if (current.trim()) tokens.push(current.trim());

    if (inQuotes) throw new Error(`Unclosed quote in query: ${query}`);

    return tokens;
  }

  protected async performApiRequest(
    input: SearchInput,
  ): Promise<TokenMetricsBaseResponse> {
    // This method is required by the base class but not used directly for search
    throw new Error("Use performSearch method instead");
  }
}
