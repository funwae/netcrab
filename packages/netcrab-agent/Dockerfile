FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml* ./
COPY packages/netcrab-agent/package.json ./packages/netcrab-agent/

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source
COPY packages/netcrab-agent ./packages/netcrab-agent
COPY tsconfig.json ./

# Build
WORKDIR /app/packages/netcrab-agent
RUN pnpm build

# Production image
FROM node:20-alpine

WORKDIR /app

# Copy built files
COPY --from=builder /app/packages/netcrab-agent/dist ./dist
COPY --from=builder /app/packages/netcrab-agent/package.json ./

# Install production dependencies only
RUN npm install --production express compression

EXPOSE 7000

ENV NODE_ENV=production
ENV PORT=7000

CMD ["node", "dist/index.js"]

