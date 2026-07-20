const express = require('express');
const { getDb } = require('../db.cjs');
const router = express.Router();

router.get('/', async (req, res) => {
  const db = await getDb();
  const result = db.exec('SELECT * FROM finance_records ORDER BY date DESC');
  const rows = result.length ? result[0].values : [];
  const records = rows.map(r => ({
    id: r[0], date: r[1], type: r[2], customer: r[3],
    description: r[4], amount: r[5], status: r[6],
  }));
  res.json(records);
});

module.exports = router;
