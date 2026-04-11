const express = require('express');
const router = express.Router();
const TransactionService = require('../services/transaction.service');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');

// All transaction routes require authentication
router.use(authenticate);

// GET /api/transactions — all authenticated users can view
router.get('/', authorize('view_records'), (req, res, next) => {
  try {
    const result = TransactionService.getList(req.query);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
});

// GET /api/transactions/:id
router.get('/:id', authorize('view_records'), (req, res, next) => {
  try {
    const tx = TransactionService.getById(req.params.id);
    res.json({ success: true, data: tx });
  } catch (err) { next(err); }
});

// POST /api/transactions — admin only
router.post('/', authorize('create_records'), (req, res, next) => {
  try {
    const tx = TransactionService.create(req.body, req.user.id);
    res.status(201).json({ success: true, data: tx });
  } catch (err) { next(err); }
});

// PUT /api/transactions/:id — admin only
router.put('/:id', authorize('update_records'), (req, res, next) => {
  try {
    const tx = TransactionService.update(req.params.id, req.body);
    res.json({ success: true, data: tx });
  } catch (err) { next(err); }
});

// DELETE /api/transactions/:id — admin only
router.delete('/:id', authorize('delete_records'), (req, res, next) => {
  try {
    const result = TransactionService.delete(req.params.id);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
});

module.exports = router;