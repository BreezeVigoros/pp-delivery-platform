const express = require('express');
const { getDb, saveDb } = require('../db.cjs');
const router = express.Router();

router.get('/', async (req, res) => {
  const db = await getDb();
  const result = db.exec('SELECT * FROM inventory ORDER BY inboundDate DESC');
  const rows = result.length ? result[0].values : [];
  const inventory = rows.map(r => ({
    id: r[0], gradeCode: r[1], batchNo: r[2], quantity: r[3],
    packageType: r[4], packages: r[5], location: r[6], warehouseArea: r[7],
    inboundDate: r[8], producer: r[9], mfr: r[10], qualityStatus: r[11],
    receiptNo: r[12], inspector: r[13], remark: r[14],
  }));
  res.json(inventory);
});

router.post('/', async (req, res) => {
  const db = await getDb();
  const { id, gradeCode, batchNo, quantity, packageType, packages, location, warehouseArea, inboundDate, producer, mfr, qualityStatus, receiptNo, inspector, remark } = req.body;
  db.run(
    'INSERT INTO inventory VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
    [id || `INV${Date.now()}`, gradeCode, batchNo, quantity, packageType || '25kg bag', packages || 0, location, warehouseArea, inboundDate, producer, mfr, qualityStatus || 'pending', receiptNo || null, inspector, remark || '']
  );
  saveDb();
  res.json({ success: true, id });
});

router.put('/:id', async (req, res) => {
  const db = await getDb();
  const { quantity } = req.body;
  const result = db.exec('SELECT quantity FROM inventory WHERE id = ?', [req.params.id]);
  if (!result.length || !result[0].values.length) return res.status(404).json({ error: 'Not found' });
  const current = result[0].values[0][0];
  const remaining = current - quantity;
  if (remaining < 0) return res.status(400).json({ error: 'Insufficient quantity' });
  if (remaining === 0) db.run('DELETE FROM inventory WHERE id = ?', [req.params.id]);
  else db.run('UPDATE inventory SET quantity = ? WHERE id = ?', [remaining, req.params.id]);
  saveDb();
  res.json({ success: true, remaining });
});

module.exports = router;
