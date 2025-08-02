#!/usr/bin/env node

import { TokenMetricsMCPServer } from "./index.js";

interface CLIArgs {
  apiKey?: string;
  help?: boolean;
}

function parseArgs(): CLIArgs {
  const args: CLIArgs = {};

  for (let i = 2; i < process.argv.length; i++) {
    const arg = process.argv[i];

    if (arg === "--help" || arg === "-h") {
      args.help = true;
    }
  }

  return args;
}

function showHelp(): void {
  console.log(`
Token Metrics MCP Server

USAGE:
  npx -y @token-metrics-ai/mcp@latest [OPTIONS]

OPTIONS:
  --help, -h         Show this help message

EXAMPLES:
  # Run with API key from environment variable
  export TOKEN_METRICS_API_KEY=your_api_key_here
  npx -y @token-metrics-ai/mcp@latest

ENVIRONMENT VARIABLES:
  TOKEN_METRICS_API_KEY    Your Token Metrics API key

For more information, visit: https://github.com/token-metrics/mcp
`);
}

async function main(): Promise<void> {
  const args = parseArgs();

  if (args.help) {
    showHelp();
    process.exit(0);
  }

  const server = new TokenMetricsMCPServer();
  await server.start();
}

process.on("SIGINT", () => {
  console.error("Received SIGINT, shutting down gracefully");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.error("Received SIGTERM, shutting down gracefully");
  process.exit(0);
});

main().catch((error: unknown) => {
  console.error(
    "Failed to start server:",
    error instanceof Error ? error.message : String(error),
  );
  process.exit(1);
});
