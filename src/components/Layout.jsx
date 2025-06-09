import { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import ApperIcon from './ApperIcon';
import AddDealModal from './AddDealModal';
import { routes } from '../config/routes';

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAddDealModalOpen, setIsAddDealModalOpen] = useState(false);
  const { theme, toggleTheme, isDark } = useTheme();
  const location = useLocation();

const navigationItems = [
    routes.dashboard,
    routes.categories,
    routes.budget,
    routes.calendar,
    routes.deals
  ];

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

return (
    <div className="h-screen flex flex-col overflow-hidden bg-white dark:bg-dark-50 theme-transition">
      {/* Header */}
      <header className="flex-shrink-0 h-16 bg-white dark:bg-dark-100 border-b border-surface-200 dark:border-dark-200 flex items-center justify-between px-4 lg:px-6 z-40 theme-transition">
        <div className="flex items-center">
<button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-surface-600 dark:text-dark-600 hover:text-surface-900 dark:hover:text-dark-900 hover:bg-surface-100 dark:hover:bg-dark-200 rounded-lg theme-transition"
          >
            <ApperIcon name="Menu" size={20} />
          </button>
          
          <div className="flex items-center ml-2 lg:ml-0">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <ApperIcon name="Vault" size={20} className="text-white" />
            </div>
<h1 className="ml-3 text-xl font-display font-bold text-surface-900 dark:text-dark-900">DealVault</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className="p-2 text-surface-600 dark:text-dark-600 hover:text-surface-900 dark:hover:text-dark-900 hover:bg-surface-100 dark:hover:bg-dark-200 rounded-lg theme-transition"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <ApperIcon name={isDark ? "Sun" : "Moon"} size={20} />
          </motion.button>
{/* Add Deal Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAddDealModalOpen(true)}
            className="bg-accent hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 shadow-lg theme-transition"
          >
            <ApperIcon name="Plus" size={16} />
            <span className="hidden sm:inline">Add LTD</span>
          </motion.button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
{/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-64 bg-surface-50 dark:bg-dark-100 border-r border-surface-200 dark:border-dark-200 z-40 theme-transition">
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {navigationItems.map((item) => (
                <NavLink
                  key={item.id}
                  to={item.path}
                  className={({ isActive }) =>
`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium theme-transition ${
                      isActive
                        ? 'bg-primary text-white shadow-lg dark:shadow-elevation-1-dark'
                        : 'text-surface-600 dark:text-dark-600 hover:text-surface-900 dark:hover:text-dark-900 hover:bg-surface-100 dark:hover:bg-dark-200'
                    }`
                  }
                >
                  <ApperIcon name={item.icon} size={18} />
                  {item.label}
                </NavLink>
              ))}
            </div>
          </nav>
        </aside>

        {/* Mobile Sidebar */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="lg:hidden fixed inset-0 bg-black/50 z-50"
                onClick={closeMobileMenu}
              />
              <motion.aside
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: 'tween', duration: 0.3 }}
className="lg:hidden fixed top-0 left-0 w-72 h-full bg-white dark:bg-dark-100 shadow-xl dark:shadow-elevation-2-dark z-50 theme-transition"
              >
<div className="p-4 border-b border-surface-200 dark:border-dark-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                        <ApperIcon name="Vault" size={20} className="text-white" />
                      </div>
<h1 className="ml-3 text-xl font-display font-bold text-surface-900 dark:text-dark-900">DealVault</h1>
                    </div>
                    <button
onClick={closeMobileMenu}
                      className="p-2 text-surface-600 dark:text-dark-600 hover:text-surface-900 dark:hover:text-dark-900 hover:bg-surface-100 dark:hover:bg-dark-200 rounded-lg theme-transition"
                    >
                      <ApperIcon name="X" size={20} />
                    </button>
                  </div>
                </div>
                
                <nav className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-2">
                    {navigationItems.map((item) => (
                      <NavLink
                        key={item.id}
                        to={item.path}
                        onClick={closeMobileMenu}
                        className={({ isActive }) =>
`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium theme-transition ${
                            isActive
                              ? 'bg-primary text-white shadow-lg dark:shadow-elevation-1-dark'
                              : 'text-surface-600 dark:text-dark-600 hover:text-surface-900 dark:hover:text-dark-900 hover:bg-surface-100 dark:hover:bg-dark-200'
                          }`
                        }
                      >
                        <ApperIcon name={item.icon} size={18} />
                        {item.label}
                      </NavLink>
                    ))}
                  </div>
                </nav>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
<main className="flex-1 overflow-y-auto bg-surface-50 dark:bg-dark-50 theme-transition">
          <div className="max-w-full overflow-hidden">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Add Deal Modal */}
      <AddDealModal
        isOpen={isAddDealModalOpen}
        onClose={() => setIsAddDealModalOpen(false)}
      />
    </div>
  );
};

export default Layout;