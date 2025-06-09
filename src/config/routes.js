import React, { Suspense } from 'react';
import HomePage from '@/components/pages/HomePage';
import Dashboard from '@/pages/Dashboard';
import Categories from '@/pages/Categories';
import Calendar from '@/pages/Calendar';
import AllDeals from '@/pages/AllDeals';
import NotFound from '@/pages/NotFound';

// Lazy load Budget component with proper error boundary
const Budget = React.lazy(() => 
  import('@/pages/Budget').catch(err => {
    console.error('Failed to load Budget component:', err);
    // Return a fallback component instead of throwing
    return {
      default: () => (
        <div className="p-6 text-center">
          <div className="max-w-md mx-auto bg-white dark:bg-dark-100 rounded-lg shadow-elevation-1 dark:shadow-elevation-1-dark p-6">
            <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-surface-900 dark:text-dark-900 mb-2">
              Budget Page Unavailable
            </h3>
            <p className="text-surface-600 dark:text-dark-600 mb-4">
              The budget page could not be loaded. Please try refreshing or contact support.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      )
    };
  })
);

// Wrapper component for Budget with Suspense
const BudgetWithSuspense = () => (
  <Suspense 
    fallback={
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-surface-600 dark:text-dark-600">Loading Budget...</p>
      </div>
    }
  >
    <Budget />
  </Suspense>
);

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/',
    icon: 'Home',
    component: HomePage
  },
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'BarChart3',
    component: Dashboard
  },
  categories: {
    id: 'categories',
    label: 'Categories',
    path: '/categories',
    icon: 'Grid3X3',
    component: Categories
  },
  calendar: {
    id: 'calendar',
    label: 'Calendar',
    path: '/calendar',
    icon: 'Calendar',
    component: Calendar
  },
  budget: {
    id: 'budget',
    label: 'Budget',
    path: '/budget',
    icon: 'PiggyBank',
    component: BudgetWithSuspense
  },
  deals: {
    id: 'deals',
    label: 'All Deals',
    path: '/deals',
    icon: 'Package',
    component: AllDeals
  },
  notFound: {
    id: 'notFound',
    label: 'Not Found',
    path: '*',
    component: NotFound
  }
};

export const routeArray = Object.values(routes);