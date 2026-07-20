const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health check endpoint (before auth middleware)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// Load routes (with error handling)
let authMiddleware, authRoutes, inventoryRoutes, receiptRoutes, deliveryRoutes, qualityRoutes, financeRoutes, reportRoutes;

try {
  authMiddleware = require('./middleware/auth.cjs').authMiddleware;
  authRoutes = require('./routes/auth.cjs');
  inventoryRoutes = require('./routes/inventory.cjs');
  receiptRoutes = require('./routes/receipts.cjs');
  deliveryRoutes = require('./routes/deliveries.cjs');
  qualityRoutes = require('./routes/quality.cjs');
  financeRoutes = require('./routes/finance.cjs');
  reportRoutes = require('./routes/reports.cjs');

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

  console.log('All routes loaded successfully');
} catch (err) {
  console.error('Route loading error:', err.message);
}

// Static files
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));

// SPA fallback - catch all unmatched GET requests (Express 5 compatible)
app.use((req, res, next) => {
  if (req.method !== 'GET' || res.headersSent) return next();
  res.sendFile(path.join(distPath, 'index.html'));
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log('========================================');
  console.log('  PP期货交割仓智能管理平台');
  console.log('========================================');
  console.log(`  端口: ${PORT}`);
  console.log(`  登录账号: admin / admin123`);
  console.log('========================================');
});

// Handle startup errors
server.on('error', (err) => {
  console.error('Server error:', err.message);
  process.exit(1);
});
