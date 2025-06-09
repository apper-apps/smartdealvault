import React from 'react';
import HomePage from '@/components/pages/HomePage';
import Dashboard from '@/pages/Dashboard';
import Categories from '@/pages/Categories';
import Calendar from '@/pages/Calendar';
import AllDeals from '@/pages/AllDeals';
import NotFound from '@/pages/NotFound';
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
    component: () => import('@/pages/Budget').then(m => m.default).catch(() => {
      console.error('Failed to load Budget component');
      return () => React.createElement('div', { 
        className: 'p-6 text-center text-surface-600 dark:text-dark-600' 
      }, 'Failed to load Budget page. Please try again.');
    })
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