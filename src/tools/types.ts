import { Tool, CallToolResult } from "@modelcontextprotocol/sdk/types.js";

export type ToolResponse = CallToolResult;

export interface BaseTool {
  getToolDefinition(): Tool;
  execute(args: any): Promise<ToolResponse>;
}
