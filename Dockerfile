# ============================
# 多阶段构建 - Railway 部署
# ============================

# ---- 构建阶段 ----
FROM node:22-alpine AS builder
WORKDIR /app

# 安装所有依赖
COPY package.json package-lock.json ./
RUN npm install

# 复制源码
COPY . .

# 构建前端
RUN npx vite build

# ---- 生产阶段 ----
FROM node:22-alpine
WORKDIR /app

# 只复制生产文件
COPY --from=builder /app/package.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server

# 安装生产依赖
RUN npm install --omit=dev

# 环境变量
ENV PORT=3000
ENV NODE_ENV=production
EXPOSE 3000

# 启动
CMD ["node", "server/index.cjs"]
