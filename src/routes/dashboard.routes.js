const express = require('express');
const router = express.Router();
const DashboardService = require('../services/dashboard.service');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');

router.use(authenticate);

// GET /api/dashboard — all authenticated users
router.get('/', authorize('view_dashboard'), (req, res, next) => {
  try {
    const data = DashboardService.getFullDashboard();
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

// GET /api/dashboard/summary
router.get('/summary', authorize('view_dashboard'), (req, res, next) => {
  try {
    res.json({ success: true, data: DashboardService.getSummary() });
  } catch (err) { next(err); }
});

// GET /api/dashboard/categories/:type — analyst+
router.get('/categories/:type', authorize('view_analytics'), (req, res, next) => {
  try {
    const data = DashboardService.getCategoryBreakdown(req.params.type);
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

// GET /api/dashboard/trends/monthly — analyst+
router.get('/trends/monthly', authorize('view_analytics'), (req, res, next) => {
  try {
    const data = DashboardService.getMonthlyTrends(req.query.months);
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

// GET /api/dashboard/trends/weekly — analyst+
router.get('/trends/weekly', authorize('view_analytics'), (req, res, next) => {
  try {
    const data = DashboardService.getWeeklyTrends(req.query.weeks);
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

// GET /api/dashboard/recent — all authenticated users
router.get('/recent', authorize('view_dashboard'), (req, res, next) => {
  try {
    const data = DashboardService.getRecentActivity(req.query.limit);
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

module.exports = router;