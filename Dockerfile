# ============================================================
# Stage 1: Builder
# ============================================================
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev)
RUN npm ci

# Copy source code
COPY . .

# Run linting
RUN npm run lint || true

# ============================================================
# Stage 2: Production image
# ============================================================
FROM node:18-alpine AS production

# Add non-root user for security
RUN addgroup -S nutriapp && adduser -S nutriapp -G nutriapp

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production && npm cache clean --force

# Copy source from builder
COPY --from=builder /app/src ./src

# Set ownership
RUN chown -R nutriapp:nutriapp /app

# Switch to non-root user
USER nutriapp

# Environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# Expose application port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

# Start the application
CMD ["node", "src/server.js"]
