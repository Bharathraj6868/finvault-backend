const TransactionModel = require('../models/transaction.model');

class DashboardService {
  static getSummary() {
    const summary = TransactionModel.getSummary();
    return summary;
  }

  static getCategoryBreakdown(type) {
    if (!['income', 'expense'].includes(type)) {
      type = 'expense';
    }
    return TransactionModel.getCategoryBreakdown(type);
  }

  static getMonthlyTrends(months) {
    return TransactionModel.getMonthlyTrends(months || 6);
  }

  static getWeeklyTrends(weeks) {
    return TransactionModel.getWeeklyTrends(weeks || 8);
  }

  static getRecentActivity(limit) {
    return TransactionModel.getRecentActivity(limit || 10);
  }

  static getFullDashboard() {
    const [summary, expenseBreakdown, incomeBreakdown, monthlyTrends, recentActivity] = [
      this.getSummary(),
      this.getCategoryBreakdown('expense'),
      this.getCategoryBreakdown('income'),
      this.getMonthlyTrends(6),
      this.getRecentActivity(8)
    ];

    return { summary, expenseBreakdown, incomeBreakdown, monthlyTrends, recentActivity };
  }
}

module.exports = DashboardService;