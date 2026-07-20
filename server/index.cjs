const express = require('express');
const cors = require('cors');
const path = require('path');
const { authMiddleware } = require('./middleware/auth.cjs');
const authRoutes = require('./routes/auth.cjs');
const inventoryRoutes = require('./routes/inventory.cjs');
const receiptRoutes = require('./routes/receipts.cjs');
const deliveryRoutes = require('./routes/deliveries.cjs');
const qualityRoutes = require('./routes/quality.cjs');
const financeRoutes = require('./routes/finance.cjs');
const reportRoutes = require('./routes/reports.cjs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Auth routes (public)
app.use('/api', authRoutes);

// API routes (protected)
app.use(authMiddleware);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/receipts', receiptRoutes);
app.use('/api/deliveries', deliveryRoutes);
app.use('/api/quality', qualityRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/reports', reportRoutes);

// Static files and SPA fallback
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));
app.all('{*path}', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log('========================================');
  console.log('  PP期货交割仓智能管理平台');
  console.log('========================================');
  console.log(`  本地访问: http://localhost:${PORT}`);
  console.log(`  登录账号: admin / admin123`);
  console.log('========================================');
});
