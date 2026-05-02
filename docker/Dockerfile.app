# Stage 1: Build Next.js frontend
FROM node:20-slim AS builder

WORKDIR /app

COPY package.json ./
RUN npm install

COPY src/ ./src/
COPY public/ ./public/
COPY next.config.ts tsconfig.json postcss.config.mjs ./

RUN npm run build

# Stage 2: Production
FROM node:20-slim AS runner

WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/public ./public

EXPOSE 3000

ENV NODE_ENV=production

CMD ["npm", "start"]
