# ============================
# 多阶段构建 - 减小镜像体积
# ============================

# ---- 基础镜像 ----
FROM node:20-alpine AS builder

WORKDIR /app

# 安装依赖
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# 复制源码
COPY . .

# 构建前端
RUN npm run build

# ---- 生产镜像 ----
FROM node:20-alpine

WORKDIR /app

# 只复制生产需要的文件
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server

# 安装生产依赖
RUN npm ci --omit=dev --omit=dev

# 暴露端口
ENV PORT=3000
EXPOSE 3000

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# 启动命令
CMD ["node", "server/index.cjs"]
