# Token Metrics MCP Server

[![smithery badge](https://smithery.ai/badge/@token-metrics/mcp)](https://smithery.ai/server/@token-metrics/mcp)

The Token Metrics Model Context Protocol (MCP) server provides comprehensive cryptocurrency data, analytics, and insights through function calling. This server enables AI assistants and agents to access Token Metrics' powerful API for real-time crypto market data, trading signals, price predictions, and advanced analytics.

## Features

- **Real-time Crypto Data**: Access current prices, market cap, volume, and other key metrics
- **Trading Signals**: AI-generated trading signals for long and short positions
- **Price Predictions**: Advanced price forecasting and scenario analysis
- **Technical Analysis**: Support and resistance levels, correlation analysis
- **Market Analytics**: Comprehensive market insights and sentiment analysis
- **Quantitative Metrics**: Advanced quantitative analysis and grading systems

## Quick Start

### Using npx (Recommended)

The easiest way to get started is using npx:

```bash
# Set environment variable and run
export TOKEN_METRICS_API_KEY=your_api_key_here
npx -y @token-metrics-ai/mcp@latest
```

## Setup with AI Clients

### Claude Desktop or VS Code/Cursor

Add the following to your `claude_desktop_config.json` or `mcp.json`:

```json
{
  "mcpServers": {
    "token-metrics": {
      "command": "npx",
      "args": ["-y", "@token-metrics-ai/mcp@latest"],
      "env": {
        "TOKEN_METRICS_API_KEY": "YOUR_API_KEY"
      }
    }
  }
}
```

## Available Tools

The Token Metrics MCP server provides the following tools:

### Token Data & Prices

- `get_tokens_data` - Fetch comprehensive token information
- `get_tokens_price` - Get current token prices
- `get_tokens_hourly_ohlcv` - Hourly OHLCV data
- `get_tokens_daily_ohlcv` - Daily OHLCV data

### Trading & Analysis

- `get_tokens_trading_signal` - AI-generated trading signals
- `get_tokens_trader_grade` - Short-term trader grades
- `get_tokens_investor_grade` - Long-term investor grades
- `get_tokens_resistance_and_support` - Technical support/resistance levels
- `get_tokens_correlation` - Token correlation analysis

### Market Intelligence

- `get_market_metrics` - Overall market analytics
- `get_sentiment` - Market sentiment analysis
- `get_tokens_quant_metrics` - Quantitative metrics
- `get_tokens_scenario_analysis` - Price prediction scenarios

### Research & Reports

- `get_tokens_ai_report` - AI-generated token reports
- `get_crypto_investors` - Crypto investor information
- `get_top_tokens_by_market_cap` - Top tokens by market cap

### Indices & Portfolio

- `get_indices` - Fetch active and passive crypto indices
- `get_indices_performance` - Historical performance data for indices
- `get_indices_holdings` - Current holdings and weights for indices

## Getting Your API Key

1. Visit [Token Metrics](https://app.tokenmetrics.com/en)
2. Sign up for an account
3. Navigate to your API Dashboard
4. Generate a new API key
5. Use the API key with this MCP server

## Development

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- TypeScript

### Local Development

1. Clone the repository:

```bash
git clone https://github.com/token-metrics/mcp.git
cd mcp
```

2. Install dependencies:

```bash
npm install
```

3. Set your API key:

```bash
export TOKEN_METRICS_API_KEY=your_api_key_here
```

4. Run in development mode:

```bash
npm run start:dev
```

### Building

```bash
npm run build
```

### Testing with MCP Inspector

You can test the server using the MCP Inspector:

```bash
# Build the server first
npm run build

# Run with MCP Inspector
npx @modelcontextprotocol/inspector node build/src/cli.js
```

## Configuration

The server accepts the following configuration options:

- `--help` - Show help information

Environment variables:

- `TOKEN_METRICS_API_KEY` - Your Token Metrics API key

## Error Handling

The server includes comprehensive error handling:

- **Invalid API Key**: Returns authentication error
- **Rate Limiting**: Handles API rate limits gracefully
- **Network Issues**: Retries failed requests
- **Invalid Parameters**: Validates input parameters

## Security

- API keys are handled securely
- No sensitive data is logged
- Docker container runs as non-root user
- Input validation on all parameters

## Support

- **Documentation**: [Token Metrics API Docs](https://developer.tokenmetrics.com)
- **Issues**: [GitHub Issues](https://github.com/token-metrics/mcp/issues)
- **Support**: [Token Metrics Support](https://www.tokenmetrics.com/contact-us)

## License

MIT License - see [LICENSE](LICENSE) file for details.

<a href="https://glama.ai/mcp/servers/@token-metrics/mcp">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/@token-metrics/mcp/badge" />
</a>
