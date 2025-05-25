import { BaseTool } from "./types.js";
import { TokenDataTool } from "./token-data.js";
import { PriceTool } from "./price.js";

// Registry of all available tools
export const AVAILABLE_TOOLS: BaseTool[] = [
  new TokenDataTool(),
  new PriceTool(),
];

// Export tool classes for individual use
export { TokenDataTool, PriceTool };
export { BaseTool, ToolResponse } from "./types.js";
