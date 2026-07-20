const jwt = require('jsonwebtoken');
const JWT_SECRET = 'pp-delivery-warehouse-secret-key-2026';

function authMiddleware(req, res, next) {
  if (req.path === '/login' || req.originalUrl === '/api/login') return next();

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token expired' });
  }
}

module.exports = { authMiddleware, JWT_SECRET };
