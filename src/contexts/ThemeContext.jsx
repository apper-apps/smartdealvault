import { createContext, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { themeService } from '@/services/api/themeService';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeTheme = async () => {
      try {
        const savedTheme = await themeService.getTheme();
        setTheme(savedTheme);
        applyThemeToDocument(savedTheme);
      } catch (error) {
        console.error('Error initializing theme:', error);
        // Fallback to system preference
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const defaultTheme = systemPrefersDark ? 'dark' : 'light';
        setTheme(defaultTheme);
        applyThemeToDocument(defaultTheme);
      } finally {
        setIsLoading(false);
      }
    };

    initializeTheme();
  }, []);

  const applyThemeToDocument = (newTheme) => {
    const root = document.documentElement;
    if (newTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    
    try {
      await themeService.setTheme(newTheme);
      setTheme(newTheme);
      applyThemeToDocument(newTheme);
    } catch (error) {
      console.error('Error saving theme preference:', error);
      // Still apply the theme even if saving fails
      setTheme(newTheme);
      applyThemeToDocument(newTheme);
    }
  };

  const setThemeMode = async (newTheme) => {
    if (newTheme !== 'light' && newTheme !== 'dark') {
      console.warn('Invalid theme mode. Use "light" or "dark".');
      return;
    }

    try {
      await themeService.setTheme(newTheme);
      setTheme(newTheme);
      applyThemeToDocument(newTheme);
    } catch (error) {
      console.error('Error setting theme:', error);
      setTheme(newTheme);
      applyThemeToDocument(newTheme);
    }
  };

  const value = {
    theme,
    toggleTheme,
    setTheme: setThemeMode,
    isLoading,
    isDark: theme === 'dark',
    isLight: theme === 'light'
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface-50 dark:bg-dark-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};