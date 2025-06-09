import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { dealService } from '../services';
import ApperIcon from '../components/ApperIcon';

const Categories = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await dealService.getAll();
        setDeals(result);
        calculateCategories(result);
      } catch (err) {
        setError(err.message || 'Failed to load categories');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const calculateCategories = (dealsList) => {
    const categoryMap = {};
    
    dealsList.forEach(deal => {
      if (!categoryMap[deal.category]) {
        categoryMap[deal.category] = {
          name: deal.category,
          dealCount: 0,
          totalSpent: 0,
          deals: []
        };
      }
      categoryMap[deal.category].dealCount += 1;
      categoryMap[deal.category].totalSpent += deal.amount;
      categoryMap[deal.category].deals.push(deal);
    });

    const categoriesArray = Object.values(categoryMap).sort((a, b) => b.totalSpent - a.totalSpent);
    setCategories(categoriesArray);
  };

  const getCategoryIcon = (categoryName) => {
    const iconMap = {
      'Design Tools': 'Palette',
      'Marketing': 'Megaphone',
      'Productivity': 'Zap',
      'Development': 'Code',
      'Business': 'Briefcase',
      'Education': 'GraduationCap',
      'Analytics': 'BarChart3',
      'Communication': 'MessageSquare',
      'Finance': 'DollarSign',
      'Other': 'Package'
    };
    return iconMap[categoryName] || 'Package';
  };

  const getCategoryColor = (index) => {
    const colors = [
      'from-blue-500 to-blue-600',
      'from-purple-500 to-purple-600', 
      'from-green-500 to-green-600',
      'from-yellow-500 to-yellow-600',
      'from-red-500 to-red-600',
      'from-indigo-500 to-indigo-600',
      'from-pink-500 to-pink-600',
      'from-teal-500 to-teal-600',
      'from-orange-500 to-orange-600',
      'from-cyan-500 to-cyan-600'
    ];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <div className="h-8 bg-surface-200 rounded w-48 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-elevation-1">
              <div className="animate-pulse space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-surface-200 rounded-lg"></div>
                  <div className="h-6 bg-surface-200 rounded w-24"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-surface-200 rounded w-3/4"></div>
                  <div className="h-4 bg-surface-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-xl p-8 shadow-elevation-1 text-center">
          <ApperIcon name="AlertCircle" className="w-12 h-12 text-error mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-surface-900 mb-2">Failed to load categories</h3>
          <p className="text-surface-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="p-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-xl p-12 shadow-elevation-1 text-center"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <ApperIcon name="Grid3X3" className="w-16 h-16 text-surface-300 mx-auto" />
          </motion.div>
          <h3 className="mt-4 text-xl font-display font-semibold text-surface-900">
            No categories found
          </h3>
          <p className="mt-2 text-surface-600 max-w-md mx-auto">
            Add some lifetime deals to see them organized by category. This will help you understand your spending patterns across different types of software.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-full overflow-hidden">
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-surface-900">Deal Categories</h1>
        <p className="text-surface-600 mt-1">View your lifetime deals organized by category</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category, index) => (
          <motion.div
            key={category.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl p-6 shadow-elevation-1 hover:shadow-elevation-2 transition-all cursor-pointer border border-surface-100"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${getCategoryColor(index)} rounded-lg flex items-center justify-center`}>
                <ApperIcon name={getCategoryIcon(category.name)} className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-surface-900 break-words">{category.name}</h3>
                <p className="text-sm text-surface-600">{category.dealCount} deals</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-surface-700">Total Spent</span>
                <span className="font-semibold text-surface-900">${category.totalSpent.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-surface-700">Average Deal</span>
                <span className="font-semibold text-surface-900">
                  ${(category.totalSpent / category.dealCount).toFixed(2)}
                </span>
              </div>

              {/* Progress bar showing relative spending */}
              <div className="pt-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-surface-600">Spending in category</span>
                  <span className="text-xs text-surface-600">
                    {((category.totalSpent / deals.reduce((sum, deal) => sum + deal.amount, 0)) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-surface-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ 
                      width: `${(category.totalSpent / deals.reduce((sum, deal) => sum + deal.amount, 0)) * 100}%` 
                    }}
                    transition={{ delay: index * 0.1 + 0.5, duration: 0.8 }}
                    className={`h-2 bg-gradient-to-r ${getCategoryColor(index)} rounded-full`}
                  />
                </div>
              </div>
            </div>

            {/* Recent deals in category */}
            <div className="mt-4 pt-4 border-t border-surface-100">
              <h4 className="text-xs font-medium text-surface-600 mb-2">Recent deals</h4>
              <div className="space-y-1">
                {category.deals.slice(0, 2).map(deal => (
                  <div key={deal.id} className="flex justify-between items-center text-sm">
                    <span className="text-surface-700 truncate min-w-0 break-words">{deal.name}</span>
                    <span className="font-medium text-surface-900 ml-2">${deal.amount.toFixed(2)}</span>
                  </div>
                ))}
                {category.deals.length > 2 && (
                  <p className="text-xs text-surface-500">+{category.deals.length - 2} more</p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Categories;