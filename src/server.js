const express = require('express');
const path = require('path');
const { handleError } = require('./utils/error');
const authRoutes = require('./routes/auth.routes');
const transactionRoutes = require('./routes/transaction.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const userRoutes = require('./routes/user.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json({ limit: '1mb' }));

// Request logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const ms = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} - ${ms}ms`);
  });
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, data: { status: 'ok', timestamp: new Date().toISOString() } });
});

// Serve dashboard HTML at root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// 404 handler
app.use((req, res) => {
  if (req.originalUrl.startsWith('/api/')) {
    res.status(404).json({ success: false, error: `Route not found: ${req.method} ${req.originalUrl}` });
  } else {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
  }
});

// Error handler (must be last)
app.use(handleError);

app.listen(PORT, () => {
  console.log(`\n  FinVault Dashboard`);
  console.log(`  ─────────────────────`);
  console.log(`  Dashboard: http://localhost:${PORT}`);
  console.log(`  API:       http://localhost:${PORT}/api/health\n`);
});

module.exports = app;