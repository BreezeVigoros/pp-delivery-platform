const express = require('express');
const { getDb, saveDb } = require('../db.cjs');
const router = express.Router();

router.get('/', async (req, res) => {
  const db = await getDb();
  const result = db.exec('SELECT * FROM receipts ORDER BY registerDate DESC');
  const rows = result.length ? result[0].values : [];
  const receipts = rows.map(r => ({
    id: r[0], type: r[1], gradeCode: r[2], batchNo: r[3], quantity: r[4],
    registrant: r[5], registerDate: r[6], status: r[7],
    pledgee: r[8], pledgeDate: r[9], pledgeAmount: r[10], pledgeRate: r[11],
    expireDate: r[12], deliveryDate: r[13], deliveryContract: r[14],
    counterParty: r[15], cancelDate: r[16], remark: r[17],
  }));
  res.json(receipts);
});

router.post('/', async (req, res) => {
  const db = await getDb();
  const { id, type, gradeCode, batchNo, quantity, registrant, registerDate, expireDate, remark } = req.body;
  db.run(
    'INSERT INTO receipts (id, type, gradeCode, batchNo, quantity, registrant, registerDate, status, expireDate, remark) VALUES (?,?,?,?,?,?,?,?,?,?)',
    [id || `DCE-WZ-${Date.now().toString().slice(-8)}`, type || 'standard', gradeCode, batchNo, quantity, registrant, registerDate, 'registered', expireDate, remark || '']
  );
  saveDb();
  res.json({ success: true, id });
});

module.exports = router;
