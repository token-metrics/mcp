# Token Metrics MCP Server

A Model Context Protocol (MCP) server that provides access to Token Metrics API data for AI agents.

## Features

- **Token Data Retrieval**: Fetch comprehensive token information including names, symbols, IDs, and Token Metrics URLs
- **Token Price Data**: Get current price information for tokens by their IDs
- **Trader Grade Analysis**: Access short-term trader grades with 24h percent changes for informed trading decisions
- **Investor Grade Analysis**: Retrieve long-term investment grades including Technology and Fundamental metrics
- **OHLCV Data**: Access both hourly and daily Open, High, Low, Close, Volume data for technical analysis
- **Market Metrics**: Get overall crypto market metrics and signals for market-wide insights
- **Trading Signals**: Fetch trading signals and performance metrics to guide trading strategies
- **AI-Generated Reports**: Access comprehensive AI-generated reports including investment analyses, deep dives, and code reviews
- **Crypto Investor Data**: Retrieve crypto investor-related data and metrics
- **Top Tokens Rankings**: Get lists of top cryptocurrencies by market capitalization
- **Resistance & Support Levels**: Access technical analysis data for resistance and support levels
- **Market Sentiment Analysis**: Fetch sentiment data from various sources including news, Reddit, and Twitter
- **Quantitative Metrics**: Access advanced risk and performance metrics including Sharpe ratio, volatility, and more
- **Scenario Analysis**: Get price predictions based on different crypto market scenarios
- **Correlation Analysis**: Analyze token correlations with top 10 and bottom 10 correlated tokens
- **Flexible Querying**: Query by token ID, token name, symbol, category, exchange, or blockchain address
- **Date Range Support**: Filter data by specific date ranges for historical analysis
- **Advanced Filtering**: Filter by market cap, volume, grades, and other financial metrics
- **Pagination Support**: Control result pagination with limit and page parameters
- **Multiple Hosting Modes**: Self-hosted with environment variables OR centralized hosting with API key parameters
- **Error Handling**: Comprehensive error handling with detailed error messages
- **Type Safety**: Full TypeScript implementation with proper type definitions
- **Modular Architecture**: Clean, extensible codebase with separate tool modules and shared base functionality

## Hosting Modes

This server supports two hosting modes:

### 1. Self-Hosted Mode (Environment Variable)

Each user runs their own server instance with their API key set as an environment variable.

### 2. Centralized Hosting Mode (Parameter-based)

You host the server centrally and users provide their API keys as parameters to the tool calls.

## Installation

1. Clone or download this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Choose your hosting mode and configure accordingly (see sections below)

## API Key Setup

### For Self-Hosted Mode

Users need to set up their Token Metrics API key as an environment variable. You can get your API key from the [Token Metrics Dashboard](https://tokenmetrics.com/en/api).

#### Method 1: Environment Variable

Set the `TOKEN_METRICS_API_KEY` environment variable:

**On macOS/Linux:**

```bash
export TOKEN_METRICS_API_KEY="your-api-key-here"
```

**On Windows:**

```cmd
set TOKEN_METRICS_API_KEY=your-api-key-here
```

**Permanent setup (add to your shell profile):**

```bash
# Add this line to ~/.bashrc, ~/.zshrc, or ~/.profile
export TOKEN_METRICS_API_KEY="your-api-key-here"
```

#### Method 2: MCP Client Configuration

If you're using an MCP client, you can set the environment variable in your MCP configuration file:

```json
{
  "mcpServers": {
    "token-metrics": {
      "command": "node",
      "args": ["build/src/index.js"],
      "cwd": "/path/to/mcp-server",
      "env": {
        "TOKEN_METRICS_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

### For Centralized Hosting Mode

When you host the server centrally, **no environment variable setup is required**. Users simply provide their API key as a parameter when using the tool.

**Important**: In centralized mode, users must include their `api_key` parameter with every tool call.

## MCP Client Configuration

### Cursor IDE

For detailed Cursor IDE setup instructions, see the [Cursor Setup Guide](./CURSOR_SETUP.md).

**Recommended Configuration (Shell Script Method):**

```json
{
  "mcpServers": {
    "token-metrics": {
      "command": "/absolute/path/to/start-tm-mcp-server.sh",
      "args": []
    }
  }
}
```

**Alternative Configuration (Direct Node):**

```json
{
  "mcpServers": {
    "token-metrics": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-server/build/src/index.js"],
      "env": {
        "TOKEN_METRICS_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

**Shell Script Setup:**

Create a shell script (e.g., `start-tm-mcp-server.sh`) with:

```bash
#!/bin/bash
cd "/path/to/your/mcp-server"
export TOKEN_METRICS_API_KEY="your-api-key-here"
exec "/path/to/node" "build/src/index.js"
```

Make it executable: `chmod +x start-tm-mcp-server.sh`

**Benefits of Shell Script Method:**

- ✅ Handles complex paths with spaces automatically
- ✅ Manages environment variables in one place
- ✅ Uses specific Node.js version (useful with nvm)
- ✅ Easier to debug and modify

### Other MCP Clients

The server uses stdio transport and works with any MCP-compatible client. Configure according to your client's documentation using:

**Shell Script Method (Recommended):**

- **Command**: `/path/to/start-tm-mcp-server.sh`
- **Args**: `[]`
- **Transport**: stdio (default for MCP)

**Direct Node Method:**

- **Command**: `node`
- **Args**: `["/path/to/build/src/index.js"]`
- **Transport**: stdio (default for MCP)
- **Environment**: Set `TOKEN_METRICS_API_KEY` for self-hosted mode

## Usage

### Building and Running

```bash
# Build the project
npm run build

# Start the server
npm start

# Development mode (auto-rebuild on changes)
npm run start:dev
```

### Available MCP Tools

The server exposes 17 comprehensive tools for accessing Token Metrics API data:

#### 1. `get_tokens_data` - Token Information

Fetches comprehensive token data including names, symbols, IDs, and Token Metrics URLs.

##### Parameters

All parameters are optional, but you must provide at least one search criteria:

- **`token_id`** (optional): Comma-separated string of token IDs (e.g., "1,2,3")
- **`token_name`** (optional): Comma-separated crypto asset names (e.g., "Bitcoin,Ethereum")
- **`symbol`** (optional): Comma-separated string of token symbols (e.g., "BTC,ETH,ADA")
- **`category`** (optional): Comma-separated category names (e.g., "yield farming,defi")
- **`exchange`** (optional): Comma-separated exchange names (e.g., "binance,gate")
- **`blockchain_address`** (optional): Search by blockchain and contract address (e.g., "binance-smart-chain:0x57185189118c7e786cafd5c71f35b16012fa95ad")
- **`limit`** (optional): Limit the number of results returned (default: 50, max: 100)
- **`page`** (optional): Page number for pagination (default: 1)
- **`api_key`** (optional): Your Token Metrics API key (required for centralized hosting mode)

#### 2. `get_tokens_price` - Token Price Information

Fetches current price data for tokens by their IDs.

##### Parameters

- **`token_id`** (required): Comma-separated string of token IDs (e.g., "1,2,3")
- **`api_key`** (optional): Your Token Metrics API key (required for centralized hosting mode)

#### 3. `get_tokens_trader_grade` - Token Trader Grade

Fetches token trader grades including 24h percent change for trader grades for specific dates or date ranges.

##### Parameters

- **`token_id`** (optional): Comma-separated string of token IDs (e.g., "1,2,3")
- **`symbol`** (optional): Comma-separated string of token symbols (e.g., "BTC,ETH,ADA")
- **`startDate`** (optional): Start date in YYYY-MM-DD format (e.g., "2023-10-01")
- **`endDate`** (optional): End date in YYYY-MM-DD format (e.g., "2023-10-10")
- **`category`** (optional): Comma-separated category names (e.g., "yield farming,defi")
- **`exchange`** (optional): Comma-separated exchange names (e.g., "binance,gate")
- **`marketcap`** (optional): Minimum market cap in USD (e.g., "100")
- **`fdv`** (optional): Minimum fully diluted valuation in USD (e.g., "100")
- **`volume`** (optional): Minimum 24h trading volume in USD (e.g., "100")
- **`traderGrade`** (optional): Minimum TM Trader Grade (e.g., "17")
- **`traderGradePercentChange`** (optional): Minimum 24h percent change in TM Trader Grade (e.g., "0.14")
- **`limit`** (optional): Limit results (default: 50, max: 100)
- **`page`** (optional): Page number for pagination
- **`api_key`** (optional): Your Token Metrics API key (required for centralized hosting mode)

#### 4. `get_tokens_investor_grade` - Token Investor Grade

Fetches token long-term grades including Technology and Fundamental metrics for specific dates or date ranges.

##### Parameters

- **`token_id`** (optional): Comma-separated string of token IDs (e.g., "1,2,3")
- **`symbol`** (optional): Comma-separated string of token symbols (e.g., "BTC,ETH,ADA")
- **`startDate`** (optional): Start date in YYYY-MM-DD format (e.g., "2023-10-01")
- **`endDate`** (optional): End date in YYYY-MM-DD format (e.g., "2023-10-10")
- **`category`** (optional): Comma-separated category names (e.g., "yield farming,defi")
- **`exchange`** (optional): Comma-separated exchange names (e.g., "binance,gate")
- **`marketcap`** (optional): Minimum market cap in USD (e.g., "100")
- **`fdv`** (optional): Minimum fully diluted valuation in USD (e.g., "100")
- **`volume`** (optional): Minimum 24h trading volume in USD (e.g., "100")
- **`investorGrade`** (optional): Minimum TM Investor Grade (e.g., "17")
- **`limit`** (optional): Limit results (default: 50, max: 100)
- **`page`** (optional): Page number for pagination
- **`api_key`** (optional): Your Token Metrics API key (required for centralized hosting mode)

#### 5. `get_tokens_hourly_ohlcv` - Hourly OHLCV Data

Fetches hourly OHLCV (Open, High, Low, Close, Volume) data for tokens.

##### Parameters

- **`token_id`** (optional): Comma-separated string of token IDs (e.g., "1,2,3")
- **`symbol`** (optional): Comma-separated string of token symbols (e.g., "BTC,ETH,ADA")
- **`token_name`** (optional): Comma-separated crypto asset names (e.g., "Bitcoin,Ethereum")
- **`startDate`** (optional): Start date in YYYY-MM-DD format (e.g., "2023-10-01")
- **`endDate`** (optional): End date in YYYY-MM-DD format (e.g., "2023-10-10")
- **`limit`** (optional): Limit results (default: 50, max: 100)
- **`page`** (optional): Page number for pagination
- **`api_key`** (optional): Your Token Metrics API key (required for centralized hosting mode)

#### 6. `get_tokens_daily_ohlcv` - Daily OHLCV Data

Fetches daily OHLCV (Open, High, Low, Close, Volume) data for tokens.

##### Parameters

- **`token_id`** (optional): Comma-separated string of token IDs (e.g., "1,2,3")
- **`symbol`** (optional): Comma-separated string of token symbols (e.g., "BTC,ETH,ADA")
- **`token_name`** (optional): Comma-separated crypto asset names (e.g., "Bitcoin,Ethereum")
- **`startDate`** (optional): Start date in YYYY-MM-DD format (e.g., "2023-10-01")
- **`endDate`** (optional): End date in YYYY-MM-DD format (e.g., "2023-10-10")
- **`limit`** (optional): Limit results (default: 50, max: 100)
- **`page`** (optional): Page number for pagination
- **`api_key`** (optional): Your Token Metrics API key (required for centralized hosting mode)

#### 7. `get_market_metrics` - Market Metrics

Fetches overall crypto market metrics and signals.

##### Parameters

- **`startDate`** (optional): Start date in YYYY-MM-DD format (e.g., "2023-10-01")
- **`endDate`** (optional): End date in YYYY-MM-DD format (e.g., "2023-10-10")
- **`limit`** (optional): Limit results (default: 50, max: 100)
- **`page`** (optional): Page number for pagination
- **`api_key`** (optional): Your Token Metrics API key (required for centralized hosting mode)

#### 8. `get_tokens_trading_signal` - Trading Signals

Fetches trading signals and performance metrics for tokens.

##### Parameters

- **`token_id`** (optional): Comma-separated string of token IDs (e.g., "1,2,3")
- **`symbol`** (optional): Comma-separated string of token symbols (e.g., "BTC,ETH,ADA")
- **`startDate`** (optional): Start date in YYYY-MM-DD format (e.g., "2023-10-01")
- **`endDate`** (optional): End date in YYYY-MM-DD format (e.g., "2023-10-10")
- **`category`** (optional): Comma-separated category names (e.g., "yield farming,defi")
- **`exchange`** (optional): Comma-separated exchange names (e.g., "binance,gate")
- **`limit`** (optional): Limit results (default: 50, max: 100)
- **`page`** (optional): Page number for pagination
- **`api_key`** (optional): Your Token Metrics API key (required for centralized hosting mode)

#### 9. `get_tokens_ai_report` - AI-Generated Reports

Fetches comprehensive AI-generated reports including investment analyses, deep dives, and code reviews.

##### Parameters

- **`token_id`** (optional): Comma-separated string of token IDs (e.g., "1,2,3")
- **`symbol`** (optional): Comma-separated string of token symbols (e.g., "BTC,ETH,ADA")
- **`limit`** (optional): Limit results (default: 50, max: 100)
- **`page`** (optional): Page number for pagination
- **`api_key`** (optional): Your Token Metrics API key (required for centralized hosting mode)

#### 10. `get_crypto_investor_data` - Crypto Investor Data

Fetches crypto investor-related data and metrics.

##### Parameters

- **`limit`** (optional): Limit results (default: 50, max: 100)
- **`page`** (optional): Page number for pagination
- **`api_key`** (optional): Your Token Metrics API key (required for centralized hosting mode)

#### 11. `get_top_tokens_by_market_cap` - Top Tokens by Market Cap

Fetches the list of top cryptocurrencies by market capitalization.

##### Parameters

- **`top_k`** (optional): Number of top cryptocurrencies to retrieve (default: 50, max: 100)
- **`page`** (optional): Page number for pagination
- **`api_key`** (optional): Your Token Metrics API key (required for centralized hosting mode)

#### 12. `get_tokens_resistance_support` - Resistance and Support Levels

Fetches resistance and support level data for tokens.

##### Parameters

- **`token_id`** (optional): Comma-separated string of token IDs (e.g., "1,2,3")
- **`symbol`** (optional): Comma-separated string of token symbols (e.g., "BTC,ETH,ADA")
- **`limit`** (optional): Limit results (default: 50, max: 100)
- **`page`** (optional): Page number for pagination
- **`api_key`** (optional): Your Token Metrics API key (required for centralized hosting mode)

#### 13. `get_sentiment_data` - Market Sentiment Data

Fetches market sentiment data from various sources including news, Reddit, and Twitter.

##### Parameters

- **`startDate`** (optional): Start date in YYYY-MM-DD format (e.g., "2023-10-01")
- **`endDate`** (optional): End date in YYYY-MM-DD format (e.g., "2023-10-10")
- **`limit`** (optional): Limit results (default: 50, max: 100)
- **`page`** (optional): Page number for pagination
- **`api_key`** (optional): Your Token Metrics API key (required for centralized hosting mode)

#### 14. `get_tokens_quant_metrics` - Quantitative Metrics

Fetches quantitative risk and performance metrics for tokens.

##### Parameters

- **`token_id`** (optional): Comma-separated string of token IDs (e.g., "1,2,3")
- **`symbol`** (optional): Comma-separated string of token symbols (e.g., "BTC,ETH,ADA")
- **`startDate`** (optional): Start date in YYYY-MM-DD format (e.g., "2023-10-01")
- **`endDate`** (optional): End date in YYYY-MM-DD format (e.g., "2023-10-10")
- **`limit`** (optional): Limit results (default: 50, max: 100)
- **`page`** (optional): Page number for pagination
- **`api_key`** (optional): Your Token Metrics API key (required for centralized hosting mode)

#### 15. `get_tokens_scenario_analysis` - Scenario Analysis

Fetches price predictions based on different crypto market scenarios.

##### Parameters

- **`token_id`** (optional): Comma-separated string of token IDs (e.g., "1,2,3")
- **`symbol`** (optional): Comma-separated string of token symbols (e.g., "BTC,ETH,ADA")
- **`limit`** (optional): Limit results (default: 50, max: 100)
- **`page`** (optional): Page number for pagination
- **`api_key`** (optional): Your Token Metrics API key (required for centralized hosting mode)

#### 16. `get_tokens_correlation` - Token Correlation Analysis

Fetches top 10 and bottom 10 correlated tokens from the top 100 market cap tokens.

##### Parameters

- **`token_id`** (optional): Comma-separated string of token IDs (e.g., "1,2,3")
- **`symbol`** (optional): Comma-separated string of token symbols (e.g., "BTC,ETH,ADA")
- **`token_name`** (optional): Comma-separated crypto asset names (e.g., "Bitcoin,Ethereum")
- **`category`** (optional): Comma-separated category names (e.g., "yield farming,defi")
- **`exchange`** (optional): Comma-separated exchange names (e.g., "binance,gate")
- **`limit`** (optional): Limit results (default: 50, max: 100)
- **`page`** (optional): Page number for pagination
- **`api_key`** (optional): Your Token Metrics API key (required for centralized hosting mode)

### Example Usage

**Self-Hosted Mode (with environment variable):**

```json
{
  "symbol": "BTC"
}
```

```json
{
  "token_name": "Bitcoin,Ethereum",
  "limit": 10
}
```

```json
{
  "category": "defi",
  "exchange": "binance",
  "limit": 20,
  "page": 2
}
```

**Centralized Hosting Mode (with API key parameter):**

```json
{
  "symbol": "BTC",
  "api_key": "your-api-key-here"
}
```

```json
{
  "blockchain_address": "ethereum:0xa0b86a33e6776d02b06c28e6d12b3b83b2b1b9d1",
  "api_key": "your-api-key-here"
}
```

### Response Format

All tools return data in a consistent format:

```json
{
  "success": true,
  "message": "Success message",
  "length": 1,
  "data": [
    {
      // Tool-specific data structure
    }
  ]
}
```

## API Configuration

The server connects to the Token Metrics API at:

- **Base URL**: `https://api.tokenmetrics.com/v2/`
- **Endpoints**:
  - `/tokens` (for token data)
  - `/price` (for price data)
  - `/trader-grades` (for trader grade data)
  - `/investor-grades` (for investor grade data)
  - `/hourly-ohlcv` (for hourly OHLCV data)
  - `/daily-ohlcv` (for daily OHLCV data)
  - `/market-metrics` (for market metrics)
  - `/trading-signals` (for trading signals)
  - `/ai-reports` (for AI-generated reports)
  - `/crypto-investor` (for crypto investor data)
  - `/top-market-cap-tokens` (for top tokens by market cap)
  - `/resistance-support` (for resistance and support levels)
  - `/sentiment` (for sentiment data)
  - `/quant-metrics` (for quantitative metrics)
  - `/scenario-analysis` (for scenario analysis)
  - `/correlation` (for correlation analysis)

## Development

### Project Structure

```
src/
├── index.ts              # Main MCP server implementation
├── tools/
│   ├── index.ts         # Tool registry and exports
│   ├── types.ts         # Base tool interfaces and types
│   ├── base-api-tool.ts # Shared API functionality base class
│   ├── token-data.ts    # Token data tool implementation
│   ├── price.ts         # Token price tool implementation
│   ├── trader-grade.ts  # Token trader grade tool implementation
│   ├── investor-grade.ts # Token investor grade tool implementation
│   ├── hourly-ohlcv.ts  # Hourly OHLCV data tool implementation
│   ├── daily-ohlcv.ts   # Daily OHLCV data tool implementation
│   ├── market-metrics.ts # Market metrics tool implementation
│   ├── trading-signal.ts # Trading signals tool implementation
│   ├── ai-report.ts     # AI-generated reports tool implementation
│   ├── crypto-investor.ts # Crypto investor data tool implementation
│   ├── top-tokens.ts    # Top tokens by market cap tool implementation
│   ├── resistance-support.ts # Resistance and support levels tool implementation
│   ├── sentiment.ts     # Market sentiment data tool implementation
│   ├── quant-metrics.ts # Quantitative metrics tool implementation
│   ├── scenario-analysis.ts # Scenario analysis tool implementation
│   └── correlation.ts   # Token correlation analysis tool implementation
package.json              # Dependencies and scripts
tsconfig.json            # TypeScript configuration
README.md                # This file
CURSOR_SETUP.md          # Cursor IDE setup guide
mcp-config.json          # Example MCP configuration
```

### Adding New Tools

To add new MCP tools:

1. Create a new tool class in `src/tools/` extending the `BaseApiTool` class (for API-based tools) or implementing the `BaseTool` interface
2. Add the tool to the `AVAILABLE_TOOLS` array in `src/tools/index.ts`
3. Export the tool class from `src/tools/index.ts`
4. The server will automatically register and handle the new tool

Example for API-based tools:

```typescript
// src/tools/my-new-tool.ts
import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { BaseApiTool, TokenMetricsBaseResponse } from "./base-api-tool.js";

interface MyToolResponse extends TokenMetricsBaseResponse {
  data: Array<{
    // Define your response data structure here
  }>;
}

interface MyToolInput {
  // Define your tool's input parameters here
  api_key?: string;
}

export class MyNewTool extends BaseApiTool {
  getToolDefinition(): Tool {
    return {
      name: "my_new_tool",
      description: "Description of what this tool does",
      inputSchema: {
        type: "object",
        properties: {
          // Define your tool's parameters here
        },
        required: [],
      },
    } as Tool;
  }

  protected async performApiRequest(
    input: MyToolInput,
  ): Promise<MyToolResponse> {
    const activeApiKey = this.validateApiKey(input.api_key);
    const params = this.buildParams(input);

    return (await this.makeApiRequest(
      "/your-endpoint",
      params,
      activeApiKey,
    )) as MyToolResponse;
  }
}
```

## License

ISC License - see package.json for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For issues related to:

- **Token Metrics API**: Contact Token Metrics support
- **MCP Server**: Create an issue in this repository

## Troubleshooting

### Shell Script Issues (Recommended Method)

If you're using the shell script method and encountering issues:

1. **Script not executable**: Ensure the script has execute permissions:

   ```bash
   chmod +x start-tm-mcp-server.sh
   ```

2. **Path with spaces**: The shell script handles paths with spaces automatically. Ensure your script uses quotes around paths:

   ```bash
   cd "/path/to/mcp-server"
   ```

3. **Node.js path issues**: Verify your Node.js path in the script:

   ```bash
   which node
   # Use the output in your script
   ```

4. **API key not set**: Check that your API key is properly set in the script:

   ```bash
   export TOKEN_METRICS_API_KEY="your-actual-api-key-here"
   ```

5. **Script location**: Ensure your MCP client can access the script location. Use absolute paths.

6. **Test script manually**: Run the script directly to verify it works:
   ```bash
   ./start-tm-mcp-server.sh
   ```

### "API key is required" Error

This error occurs when the server cannot find an API key. The solution depends on your hosting mode:

**Shell Script Mode:**

1. **Check script API key**: Verify your API key is correctly set in the shell script:

   ```bash
   export TOKEN_METRICS_API_KEY="your-actual-api-key-here"
   ```

2. **Verify script execution**: Ensure the script is being executed properly by your MCP client.

**Self-Hosted Mode (Direct Node):**

1. **Verify your API key is set**:

   ```bash
   echo $TOKEN_METRICS_API_KEY
   ```

   This should display your API key. If it's empty, the variable isn't set.

2. **Check your shell profile**: Make sure you've added the export command to the correct profile file (`.bashrc`, `.zshrc`, etc.) and restarted your terminal.

3. **MCP Client Configuration**: If using an MCP client, ensure the `env` section in your configuration includes the API key.

**Centralized Hosting Mode:**

1. **Include API key parameter**: Make sure users include the `api_key` parameter in their tool calls.
2. **Validate API key format**: Ensure the API key is a non-empty string.

### API Authentication Errors

If you receive API authentication errors:

1. Verify your API key is correct in the [Token Metrics Dashboard](https://tokenmetrics.com/en/api)
2. Ensure your API key has the necessary permissions for the `/tokens` and `/price` endpoints
3. Check if your API key has expired or been revoked
4. For centralized hosting, ensure users are providing their own valid API keys

### No Results Returned

If your queries return no results:

1. **Check parameter format**: Ensure comma-separated values don't have spaces
2. **Verify search criteria**: Make sure you're using valid token symbols, names, or IDs
3. **Check pagination**: Use the `limit` and `page` parameters to navigate through results
4. **Try broader searches**: Start with simple queries and add more specific filters gradually
5. **For price data**: Ensure you're using valid token IDs that exist in the Token Metrics database
