# Dockerfile for GameServer Pro Application
# Optimized for production deployment

FROM node:18-alpine

# Create app user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Set working directory
WORKDIR /app

# Copy package files
COPY backend/package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy application files
COPY backend/ ./
COPY html/ ./html/
COPY css/ ./css/
COPY js/ ./js/

# Create necessary directories and set permissions
RUN mkdir -p /app/data && \
    chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

# Start the application
CMD ["node", "local-server.js"]

# Security labels
LABEL security.scan="true" \
      security.level="high" \
      maintainer="gameserver-pro-team@example.com"
