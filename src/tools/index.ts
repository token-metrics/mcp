import { BaseTool } from "./types.js";
import { TokenDataTool } from "./token-data.js";
import { PriceTool } from "./price.js";
import { HourlyOHLCVTool } from "./hourly-ohlcv.js";
import { DailyOHLCVTool } from "./daily-ohlcv.js";
import { TokenInvestorGradeTool } from "./investor-grade.js";
import { MarketMetricsTool } from "./market-metrics.js";
import { TokenTradingSignalTool } from "./trading-signal.js";
import { AiReportTool } from "./ai-report.js";
import { CryptoInvestorTool } from "./crypto-investor.js";
import { TopTokensTool } from "./top-tokens.js";
import { ResistanceSupportTool } from "./resistance-support.js";
import { SentimentTool } from "./sentiment.js";
import { QuantMetricsTool } from "./quant-metrics.js";
import { ScenarioAnalysisTool } from "./scenario-analysis.js";
import { CorrelationTool } from "./correlation.js";
import { IndicesTool } from "./indices.js";
import { IndicesHoldingsTool } from "./indices-holdings.js";
import { IndicesPerformanceTool } from "./indices-performance.js";
import { SearchTool } from "./search.js";
import { FetchTool } from "./fetch.js";
import { TokenHourlyTradingSignalTool } from "./hourly-trading-signals.js";
import { MoonshotTokensTool } from "./moonshot-tokens.js";
import { TokenTmGradeTool } from "./tm-grade.js";
import { TokenTmGradeHistoricalTool } from "./tm-grade-historical.js";
import { TokenTechnologyGradeTool } from "./technology-grade.js";

// Registry of all available tools
export const AVAILABLE_TOOLS: BaseTool[] = [
  new TokenDataTool(),
  new PriceTool(),
  new HourlyOHLCVTool(),
  new DailyOHLCVTool(),
  new TokenInvestorGradeTool(),
  new MarketMetricsTool(),
  new TokenTradingSignalTool(),
  new AiReportTool(),
  new CryptoInvestorTool(),
  new TopTokensTool(),
  new ResistanceSupportTool(),
  new SentimentTool(),
  new QuantMetricsTool(),
  new ScenarioAnalysisTool(),
  new CorrelationTool(),
  new IndicesTool(),
  new IndicesHoldingsTool(),
  new IndicesPerformanceTool(),
  new TokenHourlyTradingSignalTool(),
  new MoonshotTokensTool(),
  new TokenTmGradeTool(),
  new TokenTmGradeHistoricalTool(),
  new TokenTechnologyGradeTool(),
];
export const OPENAI_TOOLS = [new SearchTool(), new FetchTool()];

// Export tool classes for individual use
export {
  SearchTool,
  FetchTool,
  TokenDataTool,
  PriceTool,
  HourlyOHLCVTool,
  DailyOHLCVTool,
  TokenInvestorGradeTool,
  MarketMetricsTool,
  TokenTradingSignalTool,
  AiReportTool,
  CryptoInvestorTool,
  TopTokensTool,
  ResistanceSupportTool,
  SentimentTool,
  QuantMetricsTool,
  ScenarioAnalysisTool,
  CorrelationTool,
  IndicesTool,
  IndicesHoldingsTool,
  IndicesPerformanceTool,
  TokenHourlyTradingSignalTool,
  MoonshotTokensTool,
  TokenTmGradeTool,
  TokenTmGradeHistoricalTool,
  TokenTechnologyGradeTool,
};
export { BaseTool, ToolResponse } from "./types.js";
