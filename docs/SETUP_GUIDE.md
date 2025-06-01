# Token Metrics MCP Server Setup Guide

This guide provides detailed setup instructions for using the Token Metrics MCP server with various AI clients and platforms.

## Prerequisites

- Node.js 18 or higher
- A Token Metrics API key ([Get one here](https://app.tokenmetrics.com/en/api))

## Quick Setup

Run our automated setup script:

```bash
curl -fsSL https://raw.githubusercontent.com/token-metrics/mcp/main/scripts/setup.sh | bash
```

Or manually:

```bash
# Install via npx (recommended)
npx -y @token-metrics-ai/mcp@latest --help

# Set your API key
export TOKEN_METRICS_API_KEY=your_api_key_here
```

## Client-Specific Setup

### Claude Desktop

Claude Desktop is one of the most popular MCP clients. Here's how to set it up:

#### 1. Locate Configuration File

**macOS:**

```bash
~/Library/Application Support/Claude/claude_desktop_config.json
```

**Windows:**

```bash
%APPDATA%\Claude\claude_desktop_config.json
```

**Linux:**

```bash
~/.config/Claude/claude_desktop_config.json
```

#### 2. Add Token Metrics MCP Server

**Option A: Using npx (Recommended)**

```json
{
  "mcpServers": {
    "token-metrics": {
      "command": "npx",
      "args": [
        "-y",
        "@token-metrics-ai/mcp@latest",
        "--api-key=YOUR_TOKEN_METRICS_API_KEY"
      ]
    }
  }
}
```

**Option B: Using Environment Variable**

```json
{
  "mcpServers": {
    "token-metrics": {
      "command": "npx",
      "args": ["-y", "@token-metrics-ai/mcp@latest"],
      "env": {
        "TOKEN_METRICS_API_KEY": "YOUR_TOKEN_METRICS_API_KEY"
      }
    }
  }
}
```

#### 3. Restart Claude Desktop

After updating the configuration, restart Claude Desktop to load the MCP server.

### VS Code with Cursor

#### 1. Install MCP Extension

Install the Model Context Protocol extension from the VS Code marketplace.

#### 2. Configure MCP Settings

Add to your VS Code settings.json:

```json
{
  "mcp.servers": {
    "token-metrics": {
      "command": "npx",
      "args": ["-y", "@token-metrics-ai/mcp@latest", "--api-key=YOUR_API_KEY"]
    }
  }
}
```

#### 3. Alternative: Workspace Configuration

Create `.vscode/settings.json` in your workspace:

```json
{
  "mcp.servers": {
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

### Continue.dev

#### 1. Install Continue Extension

Install the Continue extension in VS Code.

#### 2. Configure Continue

Add to your `~/.continue/config.json`:

```json
{
  "models": [...],
  "mcpServers": [
    {
      "name": "token-metrics",
      "command": "npx",
      "args": ["-y", "@token-metrics-ai/mcp@latest", "--api-key=YOUR_API_KEY"]
    }
  ]
}
```

### Cline (formerly Claude Dev)

#### 1. Install Cline Extension

Install Cline from the VS Code marketplace.

#### 2. Configure MCP Server

In Cline settings, add:

```json
{
  "mcpServers": {
    "token-metrics": {
      "command": "npx",
      "args": ["-y", "@token-metrics-ai/mcp@latest", "--api-key=YOUR_API_KEY"]
    }
  }
}
```

### Custom MCP Client

For custom implementations, use the stdio transport:

```javascript
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";

const transport = new StdioClientTransport({
  command: "npx",
  args: ["-y", "@token-metrics-ai/mcp@latest", "--api-key=YOUR_API_KEY"],
});

const client = new Client(
  {
    name: "my-client",
    version: "1.0.0",
  },
  {
    capabilities: {},
  },
);

await client.connect(transport);
```

## Environment Variables

### Setting API Key

**macOS/Linux:**

```bash
export TOKEN_METRICS_API_KEY=your_api_key_here
```

**Windows (Command Prompt):**

```cmd
set TOKEN_METRICS_API_KEY=your_api_key_here
```

**Windows (PowerShell):**

```powershell
$env:TOKEN_METRICS_API_KEY="your_api_key_here"
```

### Permanent Setup

**macOS/Linux (Bash):**

```bash
echo 'export TOKEN_METRICS_API_KEY=your_api_key_here' >> ~/.bashrc
source ~/.bashrc
```

**macOS (Zsh):**

```bash
echo 'export TOKEN_METRICS_API_KEY=your_api_key_here' >> ~/.zshrc
source ~/.zshrc
```

**Windows (Permanent):**

```cmd
setx TOKEN_METRICS_API_KEY "your_api_key_here"
```

## Troubleshooting

### Common Issues

#### 1. "Command not found: npx"

**Solution:** Install Node.js from [nodejs.org](https://nodejs.org)

#### 2. "API key is required"

**Solutions:**

- Ensure API key is set: `echo $TOKEN_METRICS_API_KEY`
- Check API key format (should be a string)
- Verify API key is valid at [Token Metrics Dashboard](https://app.tokenmetrics.com/en/api)

#### 3. "Permission denied"

**Solution:** Make sure you have execute permissions:

```bash
chmod +x /path/to/script
```

#### 4. "Module not found"

**Solution:** Clear npm cache and reinstall:

```bash
npm cache clean --force
npx -y @token-metrics-ai/mcp@latest --api-key=your_key
```

### Testing Connection

Test the server manually:

```bash
# Test help command
npx -y @token-metrics-ai/mcp@latest --help

# Test with MCP Inspector
npx @modelcontextprotocol/inspector npx @token-metrics-ai/mcp@latest --api-key=your_key
```

## Security Best Practices

1. **Never commit API keys** to version control
2. **Use environment variables** for API keys in production
3. **Rotate API keys** regularly
4. **Monitor API usage** in Token Metrics dashboard

## Getting Help

- **Documentation:** [GitHub Repository](https://github.com/token-metrics/mcp)
- **Issues:** [GitHub Issues](https://github.com/token-metrics/mcp/issues)
- **API Documentation:** [Token Metrics API Docs](https://developer.tokenmetrics.com)
- **Support:** [Token Metrics Support](https://www.tokenmetrics.com/contact-us)

## Next Steps

After setup, you can:

1. **Test the connection** with your AI client
2. **Explore available tools** using the help command
3. **Try example queries** from the README
4. **Read the API documentation** for advanced usage
5. **Join the community** for tips and best practices
