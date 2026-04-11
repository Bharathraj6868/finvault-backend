const db = require('../config/database');
const UserModel = require('../models/user.model');
const TransactionModel = require('../models/transaction.model');
const { v4: uuidv4 } = require('uuid');

// Clear existing data
db.exec('DELETE FROM transactions');
db.exec('DELETE FROM users');

// Create users
const users = [
  { id: uuidv4(), name: 'Sarah Chen',     email: 'sarah@finvault.io',  password: 'Admin123!', role: 'admin' },
  { id: uuidv4(), name: 'Marcus Rivera',  email: 'marcus@finvault.io', password: 'Analyst123!', role: 'analyst' },
  { id: uuidv4(), name: 'Emily Nakamura', email: 'emily@finvault.io',  password: 'Viewer123!', role: 'viewer' },
  { id: uuidv4(), name: 'James Okafor',   email: 'james@finvault.io',  password: 'Analyst456!', role: 'analyst' },
  { id: uuidv4(), name: 'Priya Sharma',   email: 'priya@finvault.io',  password: 'Viewer456!', role: 'viewer' },
];

users.forEach(u => UserModel.create(u));

// Generate transactions
const incomeTemplates = [
  { cat: 'Salary',          descs: ['Monthly salary', 'Salary payment', 'Paycheck deposit'], range: [4800, 6200] },
  { cat: 'Freelance',       descs: ['UI design project', 'Website development', 'Consulting fee'], range: [500, 3000] },
  { cat: 'Investments',     descs: ['Dividend payout', 'Stock gains', 'Portfolio return'], range: [200, 1500] },
  { cat: 'Rental Income',   descs: ['Property rent', 'Office space rental'], range: [1200, 2000] },
  { cat: 'Other Income',    descs: ['Cashback reward', 'Referral bonus', 'Tax refund'], range: [50, 500] },
];
const expenseTemplates = [
  { cat: 'Food & Dining',    descs: ['Grocery store', 'Restaurant dinner', 'Coffee shop', 'Food delivery'], range: [15, 200] },
  { cat: 'Transportation',   descs: ['Gas station', 'Uber ride', 'Car maintenance', 'Parking fee'], range: [10, 150] },
  { cat: 'Utilities',        descs: ['Electric bill', 'Internet service', 'Water bill', 'Phone plan'], range: [40, 200] },
  { cat: 'Entertainment',    descs: ['Movie tickets', 'Streaming subscription', 'Concert tickets'], range: [10, 80] },
  { cat: 'Shopping',         descs: ['Clothing purchase', 'Electronics', 'Home supplies'], range: [20, 500] },
  { cat: 'Healthcare',       descs: ['Doctor visit', 'Pharmacy', 'Gym membership'], range: [25, 300] },
  { cat: 'Education',        descs: ['Online course', 'Books purchase', 'Workshop fee'], range: [15, 200] },
  { cat: 'Other Expense',    descs: ['Gift purchase', 'Charity donation', 'Miscellaneous'], range: [10, 150] },
];

const insertTx = db.prepare(`
  INSERT INTO transactions (id, user_id, amount, type, category, description, date)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

const adminId = users[0].id;
const rand = (min, max) => Math.round((min + Math.random() * (max - min)) * 100) / 100;

for (let m = 5; m >= 0; m--) {
  const month = 10 - m;
  const daysInMonth = new Date(2024, month, 0).getDate();

  for (let i = 0; i < 4; i++) {
    const t = incomeTemplates[Math.floor(Math.random() * incomeTemplates.length)];
    insertTx.run(uuidv4(), adminId, rand(t.range[0], t.range[1]), 'income', t.cat,
      t.descs[Math.floor(Math.random() * t.descs.length)],
      `2024-${String(month).padStart(2,'0')}-${String(1 + Math.floor(Math.random() * daysInMonth)).padStart(2,'0')}`
    );
  }
  for (let i = 0; i < 8; i++) {
    const t = expenseTemplates[Math.floor(Math.random() * expenseTemplates.length)];
    insertTx.run(uuidv4(), adminId, rand(t.range[0], t.range[1]), 'expense', t.cat,
      t.descs[Math.floor(Math.random() * t.descs.length)],
      `2024-${String(month).padStart(2,'0')}-${String(1 + Math.floor(Math.random() * daysInMonth)).padStart(2,'0')}`
    );
  }
}

console.log('Seed complete: ' + users.length + ' users, ' + db.prepare('SELECT COUNT(*) as c FROM transactions').get().c + ' transactions');