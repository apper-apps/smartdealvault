import budgetData from '../mockData/budgets.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let categories = [...budgetData.categories];
let budgetLimits = [...budgetData.budgetLimits];

export const budgetService = {
  // Category operations
  async getCategories() {
    await delay(200);
    return [...categories];
  },

  async getCategoryById(id) {
    await delay(150);
    const category = categories.find(c => c.id === id);
    if (!category) {
      throw new Error('Category not found');
    }
    return { ...category };
  },

  async createCategory(categoryData) {
    await delay(300);
    const newCategory = {
      id: Date.now().toString(),
      ...categoryData,
      createdAt: new Date().toISOString()
    };
    categories.push(newCategory);
    return { ...newCategory };
  },

  async updateCategory(id, updates) {
    await delay(300);
    const index = categories.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Category not found');
    }
    categories[index] = {
      ...categories[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    return { ...categories[index] };
  },

  async deleteCategory(id) {
    await delay(250);
    const index = categories.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Category not found');
    }
    const deletedCategory = categories[index];
    categories.splice(index, 1);
    
    // Also remove associated budget limits
    budgetLimits = budgetLimits.filter(bl => bl.categoryId !== id);
    
    return { ...deletedCategory };
  },

  // Budget limit operations
  async getBudgetLimits() {
    await delay(200);
    return [...budgetLimits];
  },

  async getBudgetLimitByCategory(categoryId) {
    await delay(150);
    const budgetLimit = budgetLimits.find(bl => bl.categoryId === categoryId);
    return budgetLimit ? { ...budgetLimit } : null;
  },

  async setBudgetLimit(categoryId, limitData) {
    await delay(300);
    const existingIndex = budgetLimits.findIndex(bl => bl.categoryId === categoryId);
    
    if (existingIndex !== -1) {
      // Update existing limit
      budgetLimits[existingIndex] = {
        ...budgetLimits[existingIndex],
        ...limitData,
        updatedAt: new Date().toISOString()
      };
      return { ...budgetLimits[existingIndex] };
    } else {
      // Create new limit
      const newBudgetLimit = {
        id: Date.now().toString(),
        categoryId,
        ...limitData,
        createdAt: new Date().toISOString()
      };
      budgetLimits.push(newBudgetLimit);
      return { ...newBudgetLimit };
    }
  },

  async deleteBudgetLimit(categoryId) {
    await delay(250);
    const index = budgetLimits.findIndex(bl => bl.categoryId === categoryId);
    if (index === -1) {
      throw new Error('Budget limit not found');
    }
    const deletedLimit = budgetLimits[index];
    budgetLimits.splice(index, 1);
    return { ...deletedLimit };
  }
};