const express = require('express');
const { getDb, saveDb } = require('../db.cjs');
const router = express.Router();

router.get('/', async (req, res) => {
  const db = await getDb();
  const result = db.exec('SELECT * FROM deliveries ORDER BY pairDate DESC');
  const rows = result.length ? result[0].values : [];
  const deliveries = rows.map(r => ({
    id: r[0], contract: r[1], deliveryMonth: r[2], gradeCode: r[3], quantity: r[4],
    seller: r[5], buyer: r[6], receiptId: r[7], status: r[8],
    pairDate: r[9], inspectionDate: r[10], inspectionResult: r[11],
    titleTransferDate: r[12], completeDate: r[13], deliveryFee: r[14], remark: r[15],
  }));
  res.json(deliveries);
});

router.post('/', async (req, res) => {
  const db = await getDb();
  const { id, contract, deliveryMonth, gradeCode, quantity, seller, buyer, receiptId, status, remark } = req.body;
  db.run(
    'INSERT INTO deliveries (id, contract, deliveryMonth, gradeCode, quantity, seller, buyer, receiptId, status, remark) VALUES (?,?,?,?,?,?,?,?,?,?)',
    [id || `DLV${Date.now()}`, contract, deliveryMonth, gradeCode, quantity, seller, buyer, receiptId, status || 'pending', remark || '']
  );
  saveDb();
  res.json({ success: true });
});

module.exports = router;
