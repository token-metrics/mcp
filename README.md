# Token Metrics MCP Server

A Model Context Protocol (MCP) server that provides access to Token Metrics API data for AI agents.

## Features

- **Token Data Retrieval**: Fetch comprehensive token information including names, symbols, IDs, and Token Metrics URLs
- **Token Price Data**: Get current price information for tokens by their IDs
- **Flexible Querying**: Query by token ID, token name, symbol, category, exchange, or blockchain address
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

The server exposes two tools for accessing Token Metrics API data:

#### 1. `get_token_data` - Token Information

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

##### Example Usage

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

##### Response Format

```json
{
  "success": true,
  "message": "Success message",
  "length": 1,
  "data": [
    {
      "TOKEN_ID": 1,
      "TOKEN_NAME": "Bitcoin",
      "TOKEN_SYMBOL": "BTC",
      "TM_LINK": "https://app.tokenmetrics.com/bitcoin"
    }
  ]
}
```

#### 2. `get_token_price` - Token Price Information

Fetches current price data for tokens by their IDs.

##### Parameters

- **`token_id`** (required): Comma-separated string of token IDs (e.g., "1,2,3")
- **`api_key`** (optional): Your Token Metrics API key (required for centralized hosting mode)

##### Example Usage

**Self-Hosted Mode (with environment variable):**

```json
{
  "token_id": "1"
}
```

```json
{
  "token_id": "1,2,3"
}
```

**Centralized Hosting Mode (with API key parameter):**

```json
{
  "token_id": "1",
  "api_key": "your-api-key-here"
}
```

```json
{
  "token_id": "1,2,3",
  "api_key": "your-api-key-here"
}
```

##### Response Format

```json
{
  "success": true,
  "message": "Success message",
  "length": 1,
  "data": [
    {
      "TOKEN_ID": 1,
      "TOKEN_NAME": "Bitcoin",
      "TOKEN_SYMBOL": "BTC",
      "CURRENT_PRICE": 45000.5
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
│   └── price.ts         # Token price tool implementation
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
