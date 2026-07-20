const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ====== 静态文件（不需要认证） ======
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));

// ====== 健康检查 ======
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// ====== 加载路由 ======
try {
  const { authMiddleware } = require('./middleware/auth.cjs');
  const authRoutes = require('./routes/auth.cjs');
  const inventoryRoutes = require('./routes/inventory.cjs');
  const receiptRoutes = require('./routes/receipts.cjs');
  const deliveryRoutes = require('./routes/deliveries.cjs');
  const qualityRoutes = require('./routes/quality.cjs');
  const financeRoutes = require('./routes/finance.cjs');
  const reportRoutes = require('./routes/reports.cjs');

  // Auth login (public)
  app.use('/api', authRoutes);

  // Protected API routes
  app.use('/api', authMiddleware);
  app.use('/api/inventory', inventoryRoutes);
  app.use('/api/receipts', receiptRoutes);
  app.use('/api/deliveries', deliveryRoutes);
  app.use('/api/quality', qualityRoutes);
  app.use('/api/finance', financeRoutes);
  app.use('/api/reports', reportRoutes);

  console.log('All routes loaded');
} catch (err) {
  console.error('Route error:', err.message);
}

// ====== SPA 回退（最后处理） ======
app.get(/^(?!\/api\/).*/, (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// ====== 启动 ======
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log('========================================');
  console.log('  PP期货交割仓智能管理平台');
  console.log('========================================');
  console.log('  端口: ' + PORT);
  console.log('  登录: admin / admin123');
  console.log('========================================');
});

server.on('error', (err) => {
  console.error('Server error:', err.message);
  process.exit(1);
});
