const db = require('../config/database');

class TransactionModel {
  static create({ id, user_id, amount, type, category, description, date }) {
    const stmt = db.prepare(`
      INSERT INTO transactions (id, user_id, amount, type, category, description, date)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(id, user_id, amount, type, category, description, date);
    return this.findById(id);
  }

  static findById(id) {
    return db.prepare('SELECT * FROM transactions WHERE id = ?').get(id);
  }

  static findAll({ type, category, search, startDate, endDate, limit = 20, offset = 0 } = {}) {
    let query = 'SELECT * FROM transactions WHERE 1=1';
    const params = [];

    if (type) { query += ' AND type = ?'; params.push(type); }
    if (category) { query += ' AND category = ?'; params.push(category); }
    if (search) { query += ' AND (description LIKE ? OR category LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }
    if (startDate) { query += ' AND date >= ?'; params.push(startDate); }
    if (endDate) { query += ' AND date <= ?'; params.push(endDate); }

    // Get total count
    const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as total');
    const { total } = db.prepare(countQuery).get(...params);

    query += ' ORDER BY date DESC, created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const records = db.prepare(query).all(...params);
    return { records, total, page: Math.floor(offset / limit) + 1, totalPages: Math.ceil(total / limit) };
  }

  static update(id, data) {
    const allowed = ['amount', 'type', 'category', 'description', 'date'];
    const fields = allowed.filter(f => data[f] !== undefined);
    if (fields.length === 0) return this.findById(id);

    const setClause = fields.map(f => `${f} = ?`).join(', ');
    const values = fields.map(f => data[f]);
    values.push(id);

    const result = db.prepare(`UPDATE transactions SET ${setClause}, updated_at = datetime('now') WHERE id = ?`).run(...values);
    if (result.changes === 0) return null;
    return this.findById(id);
  }

  static delete(id) {
    const result = db.prepare('DELETE FROM transactions WHERE id = ?').run(id);
    return result.changes > 0;
  }

  static getSummary() {
    const income = db.prepare("SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE type = 'income'").get().total;
    const expense = db.prepare("SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE type = 'expense'").get().total;
    const count = db.prepare('SELECT COUNT(*) as total FROM transactions').get().total;
    return { totalIncome: income, totalExpense: expense, netBalance: income - expense, transactionCount: count };
  }

  static getCategoryBreakdown(type) {
    return db.prepare(`
      SELECT category, SUM(amount) as total, COUNT(*) as count
      FROM transactions WHERE type = ? GROUP BY category ORDER BY total DESC
    `).all(type);
  }

  static getMonthlyTrends(months = 6) {
    return db.prepare(`
      SELECT
        strftime('%Y-%m', date) as month,
        type,
        SUM(amount) as total,
        COUNT(*) as count
      FROM transactions
      WHERE date >= date('now', '-' || ? || ' months')
      GROUP BY strftime('%Y-%m', date), type
      ORDER BY month DESC, type
    `).all(months);
  }

  static getRecentActivity(limit = 10) {
    return db.prepare(`
      SELECT * FROM transactions ORDER BY date DESC, created_at DESC LIMIT ?
    `).all(limit);
  }

  static getWeeklyTrends(weeks = 8) {
    return db.prepare(`
      SELECT
        strftime('%Y-W%W', date) as week,
        type,
        SUM(amount) as total
      FROM transactions
      WHERE date >= date('now', '-' || ? || ' weeks')
      GROUP BY week, type
      ORDER BY week DESC, type
    `).all(weeks);
  }
}

module.exports = TransactionModel;