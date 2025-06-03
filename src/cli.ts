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
    } else if (arg === "--api-key") {
      args.apiKey = process.argv[++i];
    } else if (arg.startsWith("--api-key=")) {
      args.apiKey = arg.split("=")[1];
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
  --api-key <key>    Token Metrics API key (can also be set via TOKEN_METRICS_API_KEY environment variable)
  --help, -h         Show this help message

EXAMPLES:
  # Run with API key as argument
  npx -y @token-metrics-ai/mcp@latest --api-key=your_api_key_here
  
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

  // Get API key from args or environment
  const apiKey = args.apiKey || process.env.TOKEN_METRICS_API_KEY;

  // if (!apiKey) {
  //   console.error("Error: Token Metrics API key is required.");
  //   console.error(
  //     "Provide it via --api-key argument or TOKEN_METRICS_API_KEY environment variable.",
  //   );
  //   console.error("Run with --help for more information.");
  //   process.exit(1);
  // }

  // Set the API key in environment for the server to use
  process.env.TOKEN_METRICS_API_KEY = apiKey;

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
