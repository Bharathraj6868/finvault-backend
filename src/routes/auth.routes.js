const express = require('express');
const router = express.Router();
const AuthService = require('../services/auth.service');
const { authenticate } = require('../middleware/auth');

// POST /api/auth/login
router.post('/login', (req, res, next) => {
  try {
    const result = AuthService.login(req.body);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
});

// GET /api/auth/profile
router.get('/profile', authenticate, (req, res, next) => {
  try {
    const profile = AuthService.getProfile(req.user.id);
    res.json({ success: true, data: profile });
  } catch (err) { next(err); }
});

module.exports = router;