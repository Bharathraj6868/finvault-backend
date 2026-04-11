const express = require('express');
const router = express.Router();
const UserService = require('../services/user.service');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');

// All user management routes require admin
router.use(authenticate, authorize('manage_users'));

// GET /api/users
router.get('/', (req, res, next) => {
  try {
    const users = UserService.getAll();
    res.json({ success: true, data: users });
  } catch (err) { next(err); }
});

// GET /api/users/:id
router.get('/:id', (req, res, next) => {
  try {
    const user = UserService.getById(req.params.id);
    res.json({ success: true, data: user });
  } catch (err) { next(err); }
});

// POST /api/users
router.post('/', (req, res, next) => {
  try {
    const user = UserService.create(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (err) { next(err); }
});

// PUT /api/users/:id
router.put('/:id', (req, res, next) => {
  try {
    const user = UserService.update(req.params.id, req.body);
    res.json({ success: true, data: user });
  } catch (err) { next(err); }
});

// DELETE /api/users/:id
router.delete('/:id', (req, res, next) => {
  try {
    const result = UserService.delete(req.params.id);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
});

module.exports = router;