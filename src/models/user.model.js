const db = require('../config/database');
const bcrypt = require('bcryptjs');

class UserModel {
  static create({ id, name, email, password, role = 'viewer' }) {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const stmt = db.prepare(`
      INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)
    `);
    stmt.run(id, name, email, hashedPassword, role);
    return this.findById(id);
  }

  static findById(id) {
    const stmt = db.prepare('SELECT id, name, email, role, status, created_at FROM users WHERE id = ?');
    return stmt.get(id);
  }

  static findByEmail(email) {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    return stmt.get(email);
  }

  static findAll() {
    const stmt = db.prepare('SELECT id, name, email, role, status, created_at FROM users ORDER BY created_at DESC');
    return stmt.all();
  }

  static update(id, data) {
    const allowed = ['name', 'email', 'role', 'status'];
    const fields = allowed.filter(f => data[f] !== undefined);
    if (fields.length === 0) return this.findById(id);

    const setClause = fields.map(f => `${f} = ?`).join(', ');
    const values = fields.map(f => data[f]);
    values.push(id);

    db.prepare(`UPDATE users SET ${setClause}, updated_at = datetime('now') WHERE id = ?`).run(...values);
    return this.findById(id);
  }

  static delete(id) {
    db.prepare('DELETE FROM transactions WHERE user_id = ?').run(id);
    db.prepare('DELETE FROM users WHERE id = ?').run(id);
    return true;
  }

  static verifyPassword(plainText, hash) {
    return bcrypt.compareSync(plainText, hash);
  }
}

module.exports = UserModel;