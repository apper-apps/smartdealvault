import budgetData from '../mockData/budgets.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let expenses = [...budgetData.expenses];

export const expenseService = {
  async getAll() {
    await delay(300);
    return [...expenses];
  },

  async getById(id) {
    await delay(200);
    const expense = expenses.find(e => e.id === id);
    if (!expense) {
      throw new Error('Expense not found');
    }
    return { ...expense };
  },

  async getByCategory(categoryId) {
    await delay(250);
    return expenses.filter(e => e.categoryId === categoryId).map(e => ({ ...e }));
  },

  async getByDateRange(startDate, endDate) {
    await delay(250);
    return expenses.filter(e => {
      const expenseDate = new Date(e.date);
      return expenseDate >= new Date(startDate) && expenseDate <= new Date(endDate);
    }).map(e => ({ ...e }));
  },

  async getMonthlyExpenses(year, month) {
    await delay(250);
    return expenses.filter(e => {
      const expenseDate = new Date(e.date);
      return expenseDate.getFullYear() === year && expenseDate.getMonth() === month;
    }).map(e => ({ ...e }));
  },

  async create(expenseData) {
    await delay(400);
    const newExpense = {
      id: Date.now().toString(),
      ...expenseData,
      createdAt: new Date().toISOString()
    };
    expenses.push(newExpense);
    return { ...newExpense };
  },

  async update(id, updates) {
    await delay(400);
    const index = expenses.findIndex(e => e.id === id);
    if (index === -1) {
      throw new Error('Expense not found');
    }
    expenses[index] = {
      ...expenses[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    return { ...expenses[index] };
  },

  async delete(id) {
    await delay(300);
    const index = expenses.findIndex(e => e.id === id);
    if (index === -1) {
      throw new Error('Expense not found');
    }
    const deletedExpense = expenses[index];
    expenses.splice(index, 1);
    return { ...deletedExpense };
  },

  // Utility methods for budget calculations
  async getCategorySpending(categoryId, year, month) {
    await delay(200);
    const monthlyExpenses = await this.getMonthlyExpenses(year, month);
    const categoryExpenses = monthlyExpenses.filter(e => e.categoryId === categoryId);
    return categoryExpenses.reduce((total, expense) => total + expense.amount, 0);
  },

  async getTotalSpending(year, month) {
    await delay(200);
    const monthlyExpenses = await this.getMonthlyExpenses(year, month);
    return monthlyExpenses.reduce((total, expense) => total + expense.amount, 0);
  }
};