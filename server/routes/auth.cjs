const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDb } = require('../db.cjs');
const { JWT_SECRET } = require('../middleware/auth.cjs');

const router = express.Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  const db = await getDb();
  const result = db.exec('SELECT * FROM users WHERE username = ?', [username]);
  if (!result.length || !result[0].values.length) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const row = result[0].values[0];
  const valid = bcrypt.compareSync(password, row[2]);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: row[0], username: row[1], role: row[3] }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ token, user: { id: row[0], username: row[1], role: row[3] } });
});

module.exports = router;
