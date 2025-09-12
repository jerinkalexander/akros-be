const jwt = require('jsonwebtoken');
const SECRET = 'your_secret_key'; // Use env variable in production

function generateToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: '1d' });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch (err) {
    return null;
  }
}

module.exports = { generateToken, verifyToken };