#!/bin/bash

# Token Metrics MCP Server Setup Script

set -e

echo "🚀 Token Metrics MCP Server Setup"
echo "=================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or higher."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2)
REQUIRED_VERSION="18.0.0"

if ! node -e "process.exit(process.version.slice(1).split('.').map(Number).reduce((a,b,i)=>(a<<8)+b) >= '$REQUIRED_VERSION'.split('.').map(Number).reduce((a,b,i)=>(a<<8)+b) ? 0 : 1)"; then
    echo "❌ Node.js version $NODE_VERSION is too old. Please install Node.js 18 or higher."
    exit 1
fi

echo "✅ Node.js version $NODE_VERSION detected"

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

echo "✅ npm is available"

# Prompt for API key
echo ""
echo "📝 API Key Setup"
echo "================"
echo "You need a Token Metrics API key to use this server."
echo "Get your API key from: https://app.tokenmetrics.com/en/api"
echo ""

read -p "Enter your Token Metrics API key (or press Enter to skip): " API_KEY

if [ -n "$API_KEY" ]; then
    # Add to shell profile
    SHELL_PROFILE=""
    if [ -f "$HOME/.zshrc" ]; then
        SHELL_PROFILE="$HOME/.zshrc"
    elif [ -f "$HOME/.bashrc" ]; then
        SHELL_PROFILE="$HOME/.bashrc"
    elif [ -f "$HOME/.bash_profile" ]; then
        SHELL_PROFILE="$HOME/.bash_profile"
    fi

    if [ -n "$SHELL_PROFILE" ]; then
        echo "export TOKEN_METRICS_API_KEY=\"$API_KEY\"" >> "$SHELL_PROFILE"
        echo "✅ API key added to $SHELL_PROFILE"
        echo "   Please restart your terminal or run: source $SHELL_PROFILE"
    else
        echo "⚠️  Could not detect shell profile. Please manually add:"
        echo "   export TOKEN_METRICS_API_KEY=\"$API_KEY\""
    fi
    
    # Set for current session
    export TOKEN_METRICS_API_KEY="$API_KEY"
    echo "✅ API key set for current session"
else
    echo "⚠️  Skipping API key setup. You can set it later with:"
    echo "   export TOKEN_METRICS_API_KEY=your_api_key_here"
fi

echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "Quick Start Options:"
echo ""
echo "1. Run with npx (recommended):"
echo "   npx -y @token-metrics-ai/mcp@latest"
echo ""
echo "2. Local development:"
echo "   git clone https://github.com/token-metrics/mcp-server.git"
echo "   cd mcp-server"
echo "   npm install"
echo "   npm run build"
echo "   npm start"
echo ""
echo "📚 For more information, visit:"
echo "   https://github.com/token-metrics/mcp-server"
echo ""
echo "🔧 To test the server:"
echo "   npx -y @token-metrics-ai/mcp@latest --help" 