const jwt = require('jsonwebtoken');
const { AppError } = require('../utils/error');

const JWT_SECRET = process.env.JWT_SECRET || 'finvault-dev-secret-key-2024';

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError(401, 'Authentication required. Provide a Bearer token.'));
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { id: decoded.id, role: decoded.role, status: decoded.status };
    if (req.user.status === 'inactive') {
      return next(new AppError(403, 'Account is inactive. Contact an administrator.'));
    }
    next();
  } catch (err) {
    next(new AppError(401, 'Invalid or expired token'));
  }
}

function generateToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role, status: user.status },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
}

module.exports = { authenticate, generateToken };