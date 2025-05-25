#!/bin/bash

# Token Metrics MCP Server Startup Script Template
# 
# Instructions:
# 1. Copy this file to your desired location (e.g., /tmp/start-token-metrics-server.sh)
# 2. Replace the paths below with your actual paths
# 3. Replace "your-api-key-here" with your actual Token Metrics API key
# 4. Make this script executable: chmod +x start-token-metrics-server.sh
# 5. Use the absolute path to this script in your MCP configuration
#
# Example MCP configuration:
# {
#   "mcpServers": {
#     "token-metrics": {
#       "command": "/absolute/path/to/start-token-metrics-server.sh",
#       "args": []
#     }
#   }
# }

# Change to your MCP server directory (replace with your actual path)
cd "/path/to/your/mcp-server"

# Set your Token Metrics API key (replace with your actual API key)
export TOKEN_METRICS_API_KEY="your-api-key-here"

# Execute the server using your Node.js installation
# Replace with your Node.js path (find it with: which node)
exec "/usr/local/bin/node" "build/src/index.js"

# Alternative Node.js paths you might need:
# exec "/Users/username/.nvm/versions/node/v20.0.0/bin/node" "build/src/index.js"  # nvm
# exec "/opt/homebrew/bin/node" "build/src/index.js"                              # Homebrew on Apple Silicon
# exec "/usr/bin/node" "build/src/index.js"                                      # System Node.js 