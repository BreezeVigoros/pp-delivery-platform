const express = require('express');
const { getDb } = require('../db.cjs');
const router = express.Router();

router.get('/', async (req, res) => {
  const db = await getDb();
  const result = db.exec('SELECT * FROM inspection_records ORDER BY date DESC');
  const rows = result.length ? result[0].values : [];
  const records = rows.map(r => ({
    id: r[0], gradeCode: r[1], batchNo: r[2], quantity: r[3],
    agency: r[4], inspector: r[5], date: r[6],
    mfr: r[7], tensile: r[8], impact: r[9], ash: r[10],
    result: r[11], reportNo: r[12],
  }));
  res.json(records);
});

module.exports = router;
