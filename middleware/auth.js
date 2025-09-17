const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET_KEY || 'your_secret_key';

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token required' });

  jwt.verify(token, SECRET, (err, decodedToken) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = decodedToken;
    next();
  });
}

module.exports = authenticateToken;