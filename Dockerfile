# ---- deps ----------------------------------------------------------------
FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# ---- build ---------------------------------------------------------------
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* values are inlined into the client bundle at build time, so
# they have to be present here rather than only at runtime.
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_GOOGLE_MAPS_API
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_GOOGLE_MAPS_API=$NEXT_PUBLIC_GOOGLE_MAPS_API

ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ---- runtime -------------------------------------------------------------
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /app/public ./public
# standalone already contains the pruned node_modules and a server.js entry.
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

USER node

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]
