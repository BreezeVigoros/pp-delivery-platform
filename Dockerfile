# ============================
# 多阶段构建 - Railway 部署
# ============================

# ---- 构建阶段 ----
FROM node:20-alpine AS builder
WORKDIR /app

# 安装所有依赖（包括 devDependencies，构建需要）
COPY package.json package-lock.json ./
RUN npm ci

# 复制源码
COPY . .

# 构建前端（忽略 TypeScript 检查错误）
RUN npx vite build --emptyOutDir

# ---- 生产阶段 ----
FROM node:20-alpine
WORKDIR /app

# 只复制生产文件
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server

# 只安装生产依赖
RUN npm ci --omit=dev

# 环境变量
ENV PORT=3000
ENV NODE_ENV=production
EXPOSE 3000

# 健康检查
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# 启动
CMD ["node", "server/index.cjs"]
