const { AppError } = require('./error');

function validateTransaction(data) {
  const errors = [];

  if (!data.amount || isNaN(data.amount) || data.amount <= 0) {
    errors.push({ field: 'amount', message: 'Amount must be a positive number' });
  }
  if (!data.type || !['income', 'expense'].includes(data.type)) {
    errors.push({ field: 'type', message: 'Type must be income or expense' });
  }
  if (!data.category || typeof data.category !== 'string' || data.category.trim().length === 0) {
    errors.push({ field: 'category', message: 'Category is required' });
  }
  if (data.category && data.category.length > 50) {
    errors.push({ field: 'category', message: 'Category must be 50 characters or less' });
  }
  if (!data.description || typeof data.description !== 'string' || data.description.trim().length === 0) {
    errors.push({ field: 'description', message: 'Description is required' });
  }
  if (data.description && data.description.length > 200) {
    errors.push({ field: 'description', message: 'Description must be 200 characters or less' });
  }
  if (!data.date || !/^\d{4}-\d{2}-\d{2}$/.test(data.date)) {
    errors.push({ field: 'date', message: 'Date must be in YYYY-MM-DD format' });
  }
  if (data.amount && data.amount > 999999999) {
    errors.push({ field: 'amount', message: 'Amount is unreasonably large' });
  }

  if (errors.length > 0) {
    throw new AppError(400, 'Validation failed', errors);
  }
  return true;
}

function validateUser(data) {
  const errors = [];
  if (!data.name || data.name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Name must be at least 2 characters' });
  }
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push({ field: 'email', message: 'Valid email is required' });
  }
  if (!data.role || !['admin', 'analyst', 'viewer'].includes(data.role)) {
    errors.push({ field: 'role', message: 'Role must be admin, analyst, or viewer' });
  }
  if (errors.length > 0) {
    throw new AppError(400, 'Validation failed', errors);
  }
  return true;
}

module.exports = { validateTransaction, validateUser };