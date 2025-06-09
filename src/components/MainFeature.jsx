import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  ShoppingBag, 
  Calendar, 
  PlusCircle, 
  DollarSign,
  Package,
  Target,
  Clock
} from 'lucide-react';

const MainFeature = () => {
  // Mock data for dashboard overview
  const dashboardStats = {
    totalDeals: 45,
    totalSpent: 2847,
    monthlySpent: 389,
    activeDeals: 42,
    categoriesCount: 8,
    avgDealValue: 63
  };

  const recentDeals = [
    { name: 'ClickFunnels Lifetime', amount: 297, date: '2024-01-15', seller: 'AppSumo' },
    { name: 'Notion Pro Plan', amount: 199, date: '2024-01-12', seller: 'PitchGround' },
    { name: 'Canva Pro Lifetime', amount: 119, date: '2024-01-10', seller: 'StackSocial' }
  ];

  const quickActions = [
    { title: 'Add New Deal', icon: PlusCircle, href: '/deals', color: 'bg-primary' },
    { title: 'View All Deals', icon: Package, href: '/deals', color: 'bg-secondary' },
    { title: 'Manage Budget', icon: Target, href: '/budget', color: 'bg-accent' },
    { title: 'Calendar View', icon: Calendar, href: '/calendar', color: 'bg-success' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-elevation-1">
        <h1 className="text-3xl font-bold text-surface-900 mb-2">Dashboard</h1>
        <p className="text-surface-600">Welcome back! Here's an overview of your lifetime deals.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-elevation-1"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-surface-600">Total Deals</p>
              <p className="text-2xl font-bold text-surface-900">{dashboardStats.totalDeals}</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg">
              <ShoppingBag className="h-6 w-6 text-primary" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-elevation-1"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-surface-600">Total Spent</p>
              <p className="text-2xl font-bold text-surface-900">${dashboardStats.totalSpent}</p>
            </div>
            <div className="p-3 bg-success/10 rounded-lg">
              <DollarSign className="h-6 w-6 text-success" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-elevation-1"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-surface-600">This Month</p>
              <p className="text-2xl font-bold text-surface-900">${dashboardStats.monthlySpent}</p>
            </div>
            <div className="p-3 bg-warning/10 rounded-lg">
              <TrendingUp className="h-6 w-6 text-warning" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-elevation-1"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-surface-600">Categories</p>
              <p className="text-2xl font-bold text-surface-900">{dashboardStats.categoriesCount}</p>
            </div>
            <div className="p-3 bg-secondary/10 rounded-lg">
              <Package className="h-6 w-6 text-secondary" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-elevation-1">
        <h2 className="text-xl font-semibold text-surface-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
            >
              <Link
                to={action.href}
                className="flex flex-col items-center p-4 rounded-lg border-2 border-surface-200 hover:border-primary hover:shadow-elevation-2 transition-all duration-200 group"
              >
                <div className={`p-3 ${action.color} rounded-lg mb-2 group-hover:scale-110 transition-transform duration-200`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm font-medium text-surface-700 text-center">{action.title}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Deals */}
      <div className="bg-white rounded-xl p-6 shadow-elevation-1">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-surface-900">Recent Deals</h2>
          <Link 
            to="/deals" 
            className="text-primary hover:text-primary/80 text-sm font-medium"
          >
            View All
          </Link>
        </div>
        <div className="space-y-4">
          {recentDeals.map((deal, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="flex items-center justify-between p-4 bg-surface-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-surface-900">{deal.name}</p>
                  <p className="text-sm text-surface-600">{deal.seller} • {deal.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-surface-900">${deal.amount}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainFeature;