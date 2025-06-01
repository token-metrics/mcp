# Cursor IDE Setup Guide

This guide shows you how to configure Cursor IDE to use the Token Metrics MCP Server.

## Important: No Port Required!

The Token Metrics MCP Server uses **stdio transport** (stdin/stdout communication), not HTTP ports. This is the standard for MCP servers and works directly with Cursor IDE.

## Configuration Methods

We recommend using the **Shell Script Method** for easier setup and better path management.

### Method 1: Shell Script (Recommended)

This method uses a shell script to handle environment setup, path management, and Node.js execution.

#### Step 1: Create the Shell Script

Create a shell script file (e.g., `start-tm-mcp-server.sh`) with the following content:

```bash
#!/bin/bash
cd "/path/to/mcp-server"
export TOKEN_METRICS_API_KEY="your-actual-api-key-here"
exec "/path/to/node" "build/src/index.js"
```

**Important customizations:**

- Replace `/path/to/mcp-server` with your actual project path
- Replace `your-actual-api-key-here` with your Token Metrics API key
- Replace `/path/to/node` with your Node.js path (find it with `which node`)

#### Step 2: Make the Script Executable

```bash
chmod +x start-tm-mcp-server.sh
```

#### Step 3: Configure Cursor MCP Settings

Add this configuration to your MCP settings file:

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

**Benefits of Shell Script Method:**

- ✅ Handles complex paths with spaces automatically
- ✅ Manages environment variables in one place
- ✅ Uses specific Node.js version (useful with nvm)
- ✅ Easier to debug and modify
- ✅ Works reliably across different shell environments

### Method 2: Direct Node Execution

#### For Self-Hosted Mode (Recommended for Personal Use)

```json
{
  "mcpServers": {
    "token-metrics": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-server/build/src/cli.js"],
      "env": {
        "TOKEN_METRICS_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

#### For Centralized Hosting Mode

```json
{
  "mcpServers": {
    "token-metrics": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-server/build/src/cli.js"],
      "env": {}
    }
  }
}
```

**Important Notes:**

- Replace `/absolute/path/to/mcp-server/` with the actual absolute path to your server directory
- For self-hosted mode, replace `your-api-key-here` with your actual Token Metrics API key
- For centralized hosting mode, users will provide API keys as parameters

## Configuration Steps

### 1. Build the Server

First, make sure the server is built:

```bash
cd /path/to/mcp-server
npm run build
```

### 2. Choose Your Configuration Method

Select either the **Shell Script Method** (recommended) or **Direct Node Execution** method above.

### 3. Add Server Configuration

Add the chosen configuration to your MCP settings file.

### 4. Alternative: Use npm script

If you prefer to use npm scripts, you can configure it like this:

```json
{
  "mcpServers": {
    "token-metrics": {
      "command": "npm",
      "args": ["start"],
      "cwd": "/absolute/path/to/mcp-server",
      "env": {
        "TOKEN_METRICS_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

### 5. Restart Cursor IDE

After updating the configuration:

1. Save the configuration file
2. Restart Cursor IDE completely
3. The Token Metrics MCP Server should now be available

## Usage in Cursor

Once configured, you can use the server in Cursor by asking questions like:

**Self-Hosted Mode:**

**Token Data Queries:**

- "What is the Token Metrics URL for Bitcoin?"
- "Get me token data for BTC, ETH, and ADA"
- "Find token information for symbols BTC and ETH with a limit of 10"
- "Search for DeFi category tokens on Binance exchange"
- "Get tokens with blockchain address ethereum:0xa0b86a33e6776d02b06c28e6d12b3b83b2b1b9d1"
- "Find token data for Bitcoin and Ethereum, show 5 results"

**Token Price Queries:**

- "Get the current price for Bitcoin (token ID 1)"
- "Fetch prices for token IDs 1, 2, and 3"
- "What's the current price of token ID 1?"
- "Get price data for multiple tokens with IDs 1,2,3"

**Trader Grade Queries:**

- "Get trader grades for BTC and ETH"
- "Find tokens with trader grade above 80"
- "Show trader grade changes for Bitcoin in the last week"
- "Get trader grades for DeFi tokens with high volume"

**Investor Grade Queries:**

- "Get investor grades for Bitcoin and Ethereum"
- "Find tokens with high fundamental grades"
- "Show long-term investment grades for top market cap tokens"

**OHLCV Data Queries:**

- "Get hourly OHLCV data for Bitcoin for the last week"
- "Fetch daily price data for ETH from January to March 2024"
- "Show me the trading volume for BTC over the past month"

**Market Analysis Queries:**

- "Get overall crypto market metrics"
- "Show me trading signals for Bitcoin"
- "Get AI-generated report for Ethereum"
- "Find resistance and support levels for BTC"

**Advanced Analytics Queries:**

- "Get quantitative risk metrics for Bitcoin"
- "Show correlation analysis for Ethereum"
- "Get scenario analysis for BTC price predictions"
- "Fetch market sentiment data for the past week"

**Top Tokens and Rankings:**

- "Get top 20 tokens by market cap"
- "Show me the highest market cap cryptocurrencies"
- "Find top performing tokens this month"

**Centralized Hosting Mode:**
The assistant will prompt users for their API key when needed, or you can provide it explicitly:

**Token Data Queries:**

- "Get Bitcoin data using my API key: your-api-key-here"
- "Search for yield farming tokens with limit 20 using API key: your-api-key-here"

**Token Price Queries:**

- "Get price for token ID 1 using API key: your-api-key-here"
- "Fetch prices for tokens 1,2,3 with my API key: your-api-key-here"

**Advanced Queries with API Key:**

- "Get trader grades for BTC with API key: your-api-key-here"
- "Fetch AI report for Ethereum using API key: your-api-key-here"
- "Get market sentiment data with my API key: your-api-key-here"

## Available Tools and Parameters

The server provides 17 comprehensive tools:

### 1. `get_tokens_data` - Token Information

Search and retrieve comprehensive token data including names, symbols, IDs, and Token Metrics URLs.

**Search Parameters:**

- **token_id**: Specific token IDs (e.g., "1,2,3")
- **token_name**: Token names (e.g., "Bitcoin,Ethereum")
- **symbol**: Token symbols (e.g., "BTC,ETH,ADA")
- **category**: Categories (e.g., "defi,yield farming")
- **exchange**: Exchanges (e.g., "binance,gate")
- **blockchain_address**: Blockchain and contract address
- **limit**: Number of results (default: 50, max: 100)
- **page**: Page number for pagination

### 2. `get_tokens_price` - Token Price Information

Fetch current price data for tokens by their IDs.

**Parameters:**

- **token_id** (required): Comma-separated token IDs (e.g., "1,2,3")
- **api_key** (optional): API key for centralized hosting mode

### 3. `get_tokens_trader_grade` - Token Trader Grade

Fetch trader grades and 24h percent changes for specific dates or date ranges.

**Parameters:**

- **token_id**: Token IDs (e.g., "1,2,3")
- **symbol**: Token symbols (e.g., "BTC,ETH,ADA")
- **startDate**: Start date (YYYY-MM-DD format)
- **endDate**: End date (YYYY-MM-DD format)
- **category**: Categories (e.g., "defi,yield farming")
- **exchange**: Exchanges (e.g., "binance,gate")
- **marketcap**: Minimum market cap in USD
- **fdv**: Minimum fully diluted valuation in USD
- **volume**: Minimum 24h trading volume in USD
- **traderGrade**: Minimum TM Trader Grade
- **traderGradePercentChange**: Minimum 24h percent change in TM Trader Grade

### 4. `get_tokens_investor_grade` - Token Investor Grade

Fetch long-term grades including Technology and Fundamental metrics.

**Parameters:**

- **token_id**: Token IDs (e.g., "1,2,3")
- **symbol**: Token symbols (e.g., "BTC,ETH,ADA")
- **startDate**: Start date (YYYY-MM-DD format)
- **endDate**: End date (YYYY-MM-DD format)
- **category**: Categories (e.g., "defi,yield farming")
- **exchange**: Exchanges (e.g., "binance,gate")
- **marketcap**: Minimum market cap in USD
- **fdv**: Minimum fully diluted valuation in USD
- **volume**: Minimum 24h trading volume in USD
- **investorGrade**: Minimum TM Investor Grade

### 5. `get_tokens_hourly_ohlcv` - Hourly OHLCV Data

Fetch hourly Open, High, Low, Close, Volume data.

**Parameters:**

- **token_id**: Token IDs (e.g., "1,2,3")
- **symbol**: Token symbols (e.g., "BTC,ETH,ADA")
- **token_name**: Token names (e.g., "Bitcoin,Ethereum")
- **startDate**: Start date (YYYY-MM-DD format)
- **endDate**: End date (YYYY-MM-DD format)

### 6. `get_tokens_daily_ohlcv` - Daily OHLCV Data

Fetch daily Open, High, Low, Close, Volume data.

**Parameters:**

- **token_id**: Token IDs (e.g., "1,2,3")
- **symbol**: Token symbols (e.g., "BTC,ETH,ADA")
- **token_name**: Token names (e.g., "Bitcoin,Ethereum")
- **startDate**: Start date (YYYY-MM-DD format)
- **endDate**: End date (YYYY-MM-DD format)

### 7. `get_market_metrics` - Market Metrics

Fetch overall crypto market metrics and signals.

**Parameters:**

- **startDate**: Start date (YYYY-MM-DD format)
- **endDate**: End date (YYYY-MM-DD format)

### 8. `get_tokens_trading_signal` - Trading Signals

Fetch trading signals and performance metrics.

**Parameters:**

- **token_id**: Token IDs (e.g., "1,2,3")
- **symbol**: Token symbols (e.g., "BTC,ETH,ADA")
- **startDate**: Start date (YYYY-MM-DD format)
- **endDate**: End date (YYYY-MM-DD format)
- **category**: Categories (e.g., "defi,yield farming")
- **exchange**: Exchanges (e.g., "binance,gate")

### 9. `get_tokens_ai_report` - AI-Generated Reports

Fetch comprehensive AI-generated reports including investment analyses, deep dives, and code reviews.

**Parameters:**

- **token_id**: Token IDs (e.g., "1,2,3")
- **symbol**: Token symbols (e.g., "BTC,ETH,ADA")

### 10. `get_crypto_investor_data` - Crypto Investor Data

Fetch crypto investor-related data and metrics.

### 11. `get_top_tokens_by_market_cap` - Top Tokens by Market Cap

Fetch the list of top cryptocurrencies by market capitalization.

**Parameters:**

- **top_k**: Number of top cryptocurrencies to retrieve (default: 50, max: 100)

### 12. `get_tokens_resistance_support` - Resistance and Support Levels

Fetch resistance and support level data.

**Parameters:**

- **token_id**: Token IDs (e.g., "1,2,3")
- **symbol**: Token symbols (e.g., "BTC,ETH,ADA")

### 13. `get_sentiment_data` - Market Sentiment Data

Fetch market sentiment data from various sources including news, Reddit, and Twitter.

**Parameters:**

- **startDate**: Start date (YYYY-MM-DD format)
- **endDate**: End date (YYYY-MM-DD format)

### 14. `get_tokens_quant_metrics` - Quantitative Metrics

Fetch quantitative risk and performance metrics.

**Parameters:**

- **token_id**: Token IDs (e.g., "1,2,3")
- **symbol**: Token symbols (e.g., "BTC,ETH,ADA")
- **startDate**: Start date (YYYY-MM-DD format)
- **endDate**: End date (YYYY-MM-DD format)

### 15. `get_tokens_scenario_analysis` - Scenario Analysis

Fetch price predictions based on different crypto market scenarios.

**Parameters:**

- **token_id**: Token IDs (e.g., "1,2,3")
- **symbol**: Token symbols (e.g., "BTC,ETH,ADA")

### 16. `get_tokens_correlation` - Token Correlation Analysis

Fetch top 10 and bottom 10 correlated tokens from the top 100 market cap tokens.

**Parameters:**

- **token_id**: Token IDs (e.g., "1,2,3")
- **symbol**: Token symbols (e.g., "BTC,ETH,ADA")
- **token_name**: Token names (e.g., "Bitcoin,Ethereum")
- **category**: Categories (e.g., "defi,yield farming")
- **exchange**: Exchanges (e.g., "binance,gate")

**Common Parameters for All Tools:**

- **limit**: Number of results (default: 50, max: 100)
- **page**: Page number for pagination
- **api_key**: API key for centralized hosting mode

## Troubleshooting

### Shell Script Issues (Recommended Method)

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

5. **Script location**: Ensure Cursor can access the script location. Avoid using `~` in paths; use absolute paths.

### Server Not Starting

1. **Check the script path**: Ensure the absolute path to your shell script is correct
2. **Verify build**: Run `npm run build` to ensure the server is compiled
3. **Check permissions**: Ensure Cursor has permission to execute the shell script
4. **Test script manually**: Run the script directly to verify it works:
   ```bash
   ./start-tm-mcp-server.sh
   ```

### API Key Issues

1. **Shell script**: Verify your API key is set correctly in the shell script
2. **Self-hosted (direct node)**: Verify your API key is set correctly in the `env` section
3. **Centralized**: Users need to provide valid API keys in their requests
4. **Validation**: Get your API key from [Token Metrics Dashboard](https://tokenmetrics.com/en/api)

### Cursor IDE Not Recognizing Server

1. **Restart completely**: Close Cursor entirely and reopen
2. **Check configuration file location**: Ensure you're editing the correct file for your OS
3. **Validate JSON**: Ensure your configuration file has valid JSON syntax
4. **Check script permissions**: Ensure the shell script is executable

### Node.js Not Found

**For Shell Script Method:**
Update your shell script with the correct Node.js path:

```bash
#!/bin/bash
cd "/path/to/your/mcp-server"
export TOKEN_METRICS_API_KEY="your-api-key-here"
exec "/absolute/path/to/node" "build/src/index.js"
```

**For Direct Node Method:**
If Cursor can't find Node.js, use the absolute path:

```json
{
  "mcpServers": {
    "token-metrics": {
      "command": "/usr/local/bin/node",
      "args": ["/absolute/path/to/mcp-server/build/src/index.js"],
      "env": {
        "TOKEN_METRICS_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

Find your Node.js path with:

```bash
which node
```

## Example Configuration Files

### Shell Script Configuration (Recommended)

```json
{
  "mcpServers": {
    "token-metrics": {
      "command": "/tmp/start-token-metrics-server.sh",
      "args": []
    },
    "other-server": {
      "command": "python",
      "args": ["/path/to/other/server.py"],
      "env": {}
    }
  }
}
```

### Direct Node Configuration

```json
{
  "mcpServers": {
    "token-metrics": {
      "command": "node",
      "args": ["/Users/username/mcp-server/build/src/index.js"],
      "env": {
        "TOKEN_METRICS_API_KEY": "tm_1234567890abcdef",
        "NODE_ENV": "production"
      }
    },
    "other-server": {
      "command": "python",
      "args": ["/path/to/other/server.py"],
      "env": {}
    }
  }
}
```

## Support

If you encounter issues:

1. Check the [main README](./README.md) for general troubleshooting
2. Verify your Token Metrics API key is valid
3. Ensure Node.js is installed and accessible
4. Check Cursor IDE documentation for MCP setup
