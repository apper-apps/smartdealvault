import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { dealService } from '../services';
import ApperIcon from './ApperIcon';

const MainFeature = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [metrics, setMetrics] = useState({
    totalSpent: 0,
    dealCount: 0,
    averageDealPrice: 0,
    monthlySpending: {},
    sellerBreakdown: {}
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await dealService.getAll();
        setDeals(result);
        calculateMetrics(result);
      } catch (err) {
        setError(err.message || 'Failed to load deals');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const calculateMetrics = (dealsList) => {
    const totalSpent = dealsList.reduce((sum, deal) => sum + deal.amount, 0);
    const dealCount = dealsList.length;
    const averageDealPrice = dealCount > 0 ? totalSpent / dealCount : 0;

    // Monthly spending breakdown
    const monthlySpending = {};
    dealsList.forEach(deal => {
      const month = new Date(deal.purchaseDate).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short' 
      });
      monthlySpending[month] = (monthlySpending[month] || 0) + deal.amount;
    });

    // Seller breakdown
    const sellerBreakdown = {};
    dealsList.forEach(deal => {
      sellerBreakdown[deal.seller] = (sellerBreakdown[deal.seller] || 0) + deal.amount;
    });

    setMetrics({
      totalSpent,
      dealCount,
      averageDealPrice,
      monthlySpending,
      sellerBreakdown
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-elevation-1">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-surface-200 rounded w-3/4"></div>
                <div className="h-8 bg-surface-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl p-6 shadow-elevation-1">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-surface-200 rounded w-1/4"></div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-surface-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-xl p-8 shadow-elevation-1 text-center">
          <ApperIcon name="AlertCircle" className="w-12 h-12 text-error mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-surface-900 mb-2">Failed to load dashboard</h3>
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

  if (deals.length === 0) {
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
            <ApperIcon name="Package" className="w-16 h-16 text-surface-300 mx-auto" />
          </motion.div>
          <h3 className="mt-4 text-xl font-display font-semibold text-surface-900">
            No lifetime deals tracked yet
          </h3>
          <p className="mt-2 text-surface-600 max-w-md mx-auto">
            Start building your investment portfolio by adding your first lifetime deal purchase. 
            Track spending, categorize deals, and gain insights into your software investments.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
          className="bg-white rounded-xl p-6 shadow-elevation-1 hover:shadow-elevation-2 transition-shadow border border-gradient-to-r from-primary/20 to-transparent"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-surface-600">Total Spent</p>
              <p className="text-2xl font-display font-bold text-surface-900">
                ${metrics.totalSpent.toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-gradient-to-br from-primary to-secondary rounded-lg">
              <ApperIcon name="DollarSign" className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-elevation-1 hover:shadow-elevation-2 transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-surface-600">Total Deals</p>
              <p className="text-2xl font-display font-bold text-surface-900">
                {metrics.dealCount}
              </p>
            </div>
            <div className="p-3 bg-gradient-to-br from-secondary to-primary rounded-lg">
              <ApperIcon name="Package" className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-elevation-1 hover:shadow-elevation-2 transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-surface-600">Average Deal</p>
              <p className="text-2xl font-display font-bold text-surface-900">
                ${metrics.averageDealPrice.toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-gradient-to-br from-accent to-orange-500 rounded-lg">
              <ApperIcon name="TrendingUp" className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-elevation-1 hover:shadow-elevation-2 transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-surface-600">This Month</p>
              <p className="text-2xl font-display font-bold text-surface-900">
                ${(() => {
                  const currentMonth = new Date().toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short' 
                  });
                  return (metrics.monthlySpending[currentMonth] || 0).toFixed(2);
                })()}
              </p>
            </div>
            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
              <ApperIcon name="Calendar" className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Deals */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-elevation-1"
      >
        <div className="p-6 border-b border-surface-200">
          <h2 className="text-xl font-display font-semibold text-surface-900">Recent Deals</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {deals.slice(0, 5).map((deal, index) => (
              <motion.div
                key={deal.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center justify-between p-4 bg-surface-50 rounded-lg hover:bg-surface-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                    <ApperIcon name="Package" className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-surface-900">{deal.name}</h3>
                    <p className="text-sm text-surface-600">
                      {deal.seller} • {new Date(deal.purchaseDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-surface-900">${deal.amount.toFixed(2)}</p>
                  <p className="text-sm text-surface-600">{deal.category}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MainFeature;