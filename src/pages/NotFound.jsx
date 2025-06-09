import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import ApperIcon from '../components/ApperIcon';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3
          }}
        >
          <ApperIcon name="AlertTriangle" className="w-24 h-24 text-accent mx-auto mb-6" />
        </motion.div>
        
        <h1 className="text-6xl font-display font-bold text-surface-900 mb-4">404</h1>
        <h2 className="text-2xl font-display font-semibold text-surface-700 mb-4">Page Not Found</h2>
        <p className="text-surface-600 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
        </p>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <NavLink
            to="/dashboard"
            className="inline-flex items-center gap-2 bg-primary hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <ApperIcon name="Home" size={20} />
            Back to Dashboard
          </NavLink>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;