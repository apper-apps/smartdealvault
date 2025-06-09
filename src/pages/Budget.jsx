import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import AddExpenseModal from '@/components/AddExpenseModal';
import { budgetService } from '@/services/api/budgetService';
import { expenseService } from '@/services/api/expenseService';

const Budget = () => {
  const [categories, setCategories] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [budgetLimits, setBudgetLimits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    loadBudgetData();
  }, [selectedMonth, selectedYear]);

  const loadBudgetData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [categoriesData, budgetLimitsData, expensesData] = await Promise.all([
        budgetService.getCategories(),
        budgetService.getBudgetLimits(),
        expenseService.getMonthlyExpenses(selectedYear, selectedMonth)
      ]);
      
      setCategories(categoriesData);
      setBudgetLimits(budgetLimitsData);
      setExpenses(expensesData);
    } catch (err) {
      setError('Failed to load budget data');
      toast.error('Failed to load budget data');
    } finally {
      setLoading(false);
    }
  };

  const handleExpenseAdded = (newExpense) => {
    setExpenses(prev => [newExpense, ...prev]);
    loadBudgetData(); // Reload to update calculations
    toast.success('Expense added successfully');
  };

  const calculateCategorySpending = (categoryId) => {
    return expenses
      .filter(expense => expense.categoryId === categoryId)
      .reduce((total, expense) => total + expense.amount, 0);
  };

  const calculateTotalSpending = () => {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  };

  const calculateTotalBudget = () => {
    return budgetLimits.reduce((total, limit) => total + limit.monthlyLimit, 0);
  };

  const getCategoryData = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    const budgetLimit = budgetLimits.find(bl => bl.categoryId === categoryId);
    const spending = calculateCategorySpending(categoryId);
    
    if (!category || !budgetLimit) return null;
    
    const percentage = (spending / budgetLimit.monthlyLimit) * 100;
    const isOverBudget = spending > budgetLimit.monthlyLimit;
    const isNearLimit = percentage >= budgetLimit.alertThreshold;
    
    return {
      category,
      budgetLimit,
      spending,
      percentage: Math.min(percentage, 100),
      isOverBudget,
      isNearLimit,
      remaining: Math.max(budgetLimit.monthlyLimit - spending, 0)
    };
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-surface-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-surface-200 rounded-lg"></div>
            ))}
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-20 bg-surface-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <ApperIcon name="AlertCircle" size={48} className="text-error mx-auto mb-4" />
          <h3 className="text-lg font-medium text-surface-900 mb-2">Error Loading Budget Data</h3>
          <p className="text-surface-600 mb-4">{error}</p>
          <Button onClick={loadBudgetData} variant="primary">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const totalSpending = calculateTotalSpending();
  const totalBudget = calculateTotalBudget();
  const totalPercentage = totalBudget > 0 ? (totalSpending / totalBudget) * 100 : 0;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-surface-900 mb-2">Budget Tracking</h1>
          <p className="text-surface-600">Monitor your spending and stay within budget limits</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-0">
          <div className="flex gap-2">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="px-3 py-2 border border-surface-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {monthNames.map((month, index) => (
                <option key={index} value={index}>{month}</option>
              ))}
            </select>
            
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="px-3 py-2 border border-surface-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {[2024, 2023, 2022].map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          
          <Button
            onClick={() => setIsAddExpenseModalOpen(true)}
            variant="primary"
            className="flex items-center gap-2"
          >
            <ApperIcon name="Plus" size={16} />
            Add Expense
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg p-6 shadow-elevation-1 border border-surface-200"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-surface-600">Total Spending</h3>
            <ApperIcon name="DollarSign" size={20} className="text-primary" />
          </div>
          <div className="text-3xl font-bold text-surface-900 mb-2">
            ${totalSpending.toFixed(2)}
          </div>
          <div className="text-sm text-surface-500">
            {monthNames[selectedMonth]} {selectedYear}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg p-6 shadow-elevation-1 border border-surface-200"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-surface-600">Total Budget</h3>
            <ApperIcon name="Target" size={20} className="text-secondary" />
          </div>
          <div className="text-3xl font-bold text-surface-900 mb-2">
            ${totalBudget.toFixed(2)}
          </div>
          <div className="text-sm text-surface-500">
            Monthly limit
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg p-6 shadow-elevation-1 border border-surface-200"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-surface-600">Remaining</h3>
            <ApperIcon name="PiggyBank" size={20} className="text-success" />
          </div>
          <div className={`text-3xl font-bold mb-2 ${
            totalSpending > totalBudget ? 'text-error' : 'text-success'
          }`}>
            ${Math.max(totalBudget - totalSpending, 0).toFixed(2)}
          </div>
          <div className="text-sm text-surface-500">
            {totalPercentage.toFixed(1)}% used
          </div>
        </motion.div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white rounded-lg shadow-elevation-1 border border-surface-200 mb-8">
        <div className="p-6 border-b border-surface-200">
          <h2 className="text-lg font-semibold text-surface-900">Category Breakdown</h2>
        </div>
        
        <div className="p-6">
          {categories.length === 0 ? (
            <div className="text-center py-8">
              <ApperIcon name="Grid3X3" size={48} className="text-surface-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-surface-900 mb-2">No Categories</h3>
              <p className="text-surface-600">Create categories to start tracking your budget</p>
            </div>
          ) : (
            <div className="space-y-6">
              {categories.map((category, index) => {
                const data = getCategoryData(category.id);
                if (!data) return null;

                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <h4 className="font-medium text-surface-900">{category.name}</h4>
                        {data.isOverBudget && (
                          <span className="px-2 py-1 bg-error/10 text-error text-xs rounded-full font-medium">
                            Over Budget
                          </span>
                        )}
                        {data.isNearLimit && !data.isOverBudget && (
                          <span className="px-2 py-1 bg-warning/10 text-warning text-xs rounded-full font-medium">
                            Near Limit
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-surface-900">
                          ${data.spending.toFixed(2)} / ${data.budgetLimit.monthlyLimit.toFixed(2)}
                        </div>
                        <div className="text-sm text-surface-500">
                          ${data.remaining.toFixed(2)} remaining
                        </div>
                      </div>
                    </div>
                    
                    <div className="w-full bg-surface-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          data.isOverBudget
                            ? 'bg-error'
                            : data.isNearLimit
                            ? 'bg-warning'
                            : 'bg-success'
                        }`}
                        style={{ width: `${data.percentage}%` }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Recent Expenses */}
      <div className="bg-white rounded-lg shadow-elevation-1 border border-surface-200">
        <div className="p-6 border-b border-surface-200">
          <h2 className="text-lg font-semibold text-surface-900">Recent Expenses</h2>
        </div>
        
        <div className="p-6">
          {expenses.length === 0 ? (
            <div className="text-center py-8">
              <ApperIcon name="Receipt" size={48} className="text-surface-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-surface-900 mb-2">No Expenses</h3>
              <p className="text-surface-600 mb-4">Add your first expense to start tracking</p>
              <Button
                onClick={() => setIsAddExpenseModalOpen(true)}
                variant="primary"
              >
                Add Expense
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {expenses.slice(0, 5).map((expense, index) => {
                const category = categories.find(c => c.id === expense.categoryId);
                return (
                  <motion.div
                    key={expense.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 border border-surface-200 rounded-lg hover:shadow-elevation-1 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      {category && (
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                      )}
                      <div>
                        <h4 className="font-medium text-surface-900">{expense.description}</h4>
                        <div className="flex items-center gap-2 text-sm text-surface-500">
                          <span>{category?.name}</span>
                          <span>•</span>
                          <span>{new Date(expense.date).toLocaleDateString()}</span>
                          {expense.seller && (
                            <>
                              <span>•</span>
                              <span>{expense.seller}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-lg font-semibold text-surface-900">
                      ${expense.amount.toFixed(2)}
                    </div>
                  </motion.div>
                );
              })}
              
              {expenses.length > 5 && (
                <div className="text-center pt-4">
                  <p className="text-sm text-surface-500">
                    Showing 5 of {expenses.length} expenses
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add Expense Modal */}
      <AddExpenseModal
        isOpen={isAddExpenseModalOpen}
        onClose={() => setIsAddExpenseModalOpen(false)}
        onExpenseAdded={handleExpenseAdded}
        categories={categories}
      />
    </div>
  );
};

export default Budget;