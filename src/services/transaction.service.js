const TransactionModel = require('../models/transaction.model');
const { validateTransaction } = require('../utils/validators');
const { AppError } = require('../utils/error');
const { v4: uuidv4 } = require('uuid');

class TransactionService {
  static create(data, userId) {
    validateTransaction(data);
    const transaction = TransactionModel.create({
      id: uuidv4(),
      user_id: userId,
      amount: data.amount,
      type: data.type,
      category: data.category.trim(),
      description: data.description.trim(),
      date: data.date
    });
    return transaction;
  }

  static getList(filters) {
    const limit = Math.min(Math.max(parseInt(filters.limit) || 20, 1), 100);
    const offset = Math.max(parseInt(filters.offset) || 0, 0);
    return TransactionModel.findAll({
      type: filters.type,
      category: filters.category,
      search: filters.search,
      startDate: filters.startDate,
      endDate: filters.endDate,
      limit,
      offset
    });
  }

  static getById(id) {
    const tx = TransactionModel.findById(id);
    if (!tx) throw new AppError(404, 'Transaction not found');
    return tx;
  }

  static update(id, data) {
    validateTransaction(data);
    const tx = TransactionModel.update(id, {
      amount: data.amount,
      type: data.type,
      category: data.category.trim(),
      description: data.description.trim(),
      date: data.date
    });
    if (!tx) throw new AppError(404, 'Transaction not found');
    return tx;
  }

  static delete(id) {
    const deleted = TransactionModel.delete(id);
    if (!deleted) throw new AppError(404, 'Transaction not found');
    return { message: 'Transaction deleted successfully' };
  }
}

module.exports = TransactionService;