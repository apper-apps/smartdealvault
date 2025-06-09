const THEME_STORAGE_KEY = 'dealvault-theme';

export const themeService = {
  // Get theme preference from localStorage
  getTheme: async () => {
    try {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      
      // If no saved theme, detect system preference
      if (!savedTheme) {
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        return systemPrefersDark ? 'dark' : 'light';
      }
      
      // Validate saved theme
      if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme;
      }
      
      // Fallback if invalid theme is stored
      return 'light';
    } catch (error) {
      console.error('Error getting theme from localStorage:', error);
      return 'light';
    }
  },

  // Save theme preference to localStorage
  setTheme: async (theme) => {
    try {
      if (theme !== 'light' && theme !== 'dark') {
        throw new Error('Invalid theme. Must be "light" or "dark".');
      }
      
      localStorage.setItem(THEME_STORAGE_KEY, theme);
      return theme;
    } catch (error) {
      console.error('Error saving theme to localStorage:', error);
      throw error;
    }
  },

  // Clear theme preference (will use system default)
  clearTheme: async () => {
    try {
      localStorage.removeItem(THEME_STORAGE_KEY);
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return systemPrefersDark ? 'dark' : 'light';
    } catch (error) {
      console.error('Error clearing theme from localStorage:', error);
      return 'light';
    }
  },

  // Listen for system theme changes
  onSystemThemeChange: (callback) => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      const systemTheme = e.matches ? 'dark' : 'light';
      callback(systemTheme);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    // Return cleanup function
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }
};