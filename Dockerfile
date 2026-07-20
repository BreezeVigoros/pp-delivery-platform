# ---- 构建阶段 ----
FROM node:22-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# ---- 生产阶段 ----
FROM node:22-alpine
WORKDIR /app

COPY --from=builder /app/package.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server

RUN npm install --omit=dev

ENV PORT=3000
ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "server/index.cjs"]
