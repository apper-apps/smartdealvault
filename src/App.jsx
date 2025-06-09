import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Layout from './components/Layout';
import { routeArray } from './config/routes';
import { useTheme } from '@/contexts/ThemeContext';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('Router Error Boundary caught an error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <div className="min-h-screen bg-surface-50 dark:bg-dark-50 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white dark:bg-dark-100 rounded-lg shadow-elevation-2 dark:shadow-elevation-2-dark p-6 text-center">
            <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-surface-900 dark:text-dark-900 mb-2">
              Something went wrong
            </h2>
            <p className="text-surface-600 dark:text-dark-600 mb-4">
              We apologize for the inconvenience. The application encountered an unexpected error.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="w-full bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
>
              Reload Application
            </button>
            {typeof process !== 'undefined' && process.env?.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm text-surface-500 dark:text-dark-500">
                  Error Details (Development)
                </summary>
                <pre className="mt-2 text-xs text-surface-600 dark:text-dark-600 bg-surface-100 dark:bg-dark-200 p-2 rounded overflow-auto">
                  {this.state.error.toString()}
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Theme-aware Toast Container Component
function ThemedToastContainer() {
  const { theme } = useTheme();
  
  return (
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme={theme}
      className="z-[9999]"
    />
  );
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <div className="h-screen flex flex-col overflow-hidden">
          <Routes>
            <Route path="/" element={<Layout />}>
              {routeArray.map((route) => (
                <Route
                  key={route.id}
                  path={route.path}
                  element={<route.component />}
                />
              ))}
            </Route>
          </Routes>
          
          <ThemedToastContainer />
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;