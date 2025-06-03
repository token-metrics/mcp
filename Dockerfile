# Use Node.js 18 Alpine for smaller image size
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --include=dev

# Copy source code
COPY . .

# Build the TypeScript code
RUN npm run build

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S tokenmetrics -u 1001

# Change ownership of the app directory
RUN chown -R tokenmetrics:nodejs /app
USER tokenmetrics

# Expose port (though MCP typically uses stdio)
EXPOSE 3000

# Set default command
ENTRYPOINT ["node", "build/src/cli.js"]

# Default to showing help if no args provided
CMD ["--help"] 