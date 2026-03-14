# Stage 1 — Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first — Docker caches this layer
# So npm install only reruns if package.json changes
COPY research-assistant/package*.json ./
RUN npm ci

# Copy source and compile TypeScript
COPY research-assistant/tsconfig.json ./
COPY research-assistant/src ./src
RUN npm run build

# Stage 2 — Production image
FROM node:20-alpine AS production

WORKDIR /app

# Only copy what's needed to run — keeps image small
COPY research-assistant/package*.json ./
RUN npm ci --only=production

# Copy compiled JS from builder stage
COPY --from=builder /app/dist ./dist

# Copy the public folder for the UI
COPY research-assistant/src/public ./dist/public

EXPOSE 3000

CMD ["node", "dist/index.js"]
