const express = require('express');
const { getDb } = require('../db.cjs');
const router = express.Router();

router.get('/stats', async (req, res) => {
  const db = await getDb();

  const invResult = db.exec('SELECT COUNT(*) as cnt, SUM(quantity) as total FROM inventory');
  const totalInventory = invResult[0].values[0][1] || 0;

  const recResult = db.exec("SELECT COUNT(*) as cnt FROM receipts WHERE status != 'cancelled'");
  const activeReceipts = recResult[0].values[0][0] || 0;

  const pendingRecResult = db.exec("SELECT COUNT(*) as cnt FROM receipts WHERE status = 'registered'");
  const pendingReceipts = pendingRecResult[0].values[0][0] || 0;

  const delResult = db.exec("SELECT COUNT(*) as cnt, SUM(quantity) as total FROM deliveries WHERE status = 'completed'");
  const completedDeliveries = delResult[0].values[0][0] || 0;
  const deliveryTotal = delResult[0].values[0][1] || 0;

  const qcResult = db.exec("SELECT COUNT(*) as cnt FROM inspection_records WHERE result = 'qualified'");
  const qcPass = qcResult[0].values[0][0] || 0;
  const qcAll = db.exec('SELECT COUNT(*) as cnt FROM inspection_records')[0].values[0][0] || 1;
  const qcRate = (qcPass / qcAll * 100).toFixed(1);

  const totalQty = invResult[0].values[0][1] || 0;
  const capacityRate = (totalQty / 20000 * 100).toFixed(1);

  res.json({
    totalInventory, activeReceipts, pendingReceipts,
    completedDeliveries, deliveryTotal, qcRate, capacityRate,
  });
});

module.exports = router;
