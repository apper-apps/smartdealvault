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