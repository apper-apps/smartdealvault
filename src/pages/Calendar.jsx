import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { dealService } from '../services';
import ApperIcon from '../components/ApperIcon';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth } from 'date-fns';

const Calendar = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await dealService.getAll();
        setDeals(result);
      } catch (err) {
        setError(err.message || 'Failed to load calendar data');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getDealsForDate = (date) => {
    return deals.filter(deal => 
      isSameDay(new Date(deal.purchaseDate), date)
    );
  };

  const getTotalSpentOnDate = (date) => {
    return getDealsForDate(date).reduce((sum, deal) => sum + deal.amount, 0);
  };

  const getDotSize = (amount) => {
    if (amount === 0) return '';
    if (amount < 50) return 'w-2 h-2';
    if (amount < 100) return 'w-3 h-3';
    if (amount < 200) return 'w-4 h-4';
    return 'w-5 h-5';
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
    setSelectedDate(null);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-xl shadow-elevation-1">
          <div className="p-6 border-b border-surface-200">
            <div className="flex items-center justify-between">
              <div className="h-8 bg-surface-200 rounded w-32 animate-pulse"></div>
              <div className="flex gap-2">
                <div className="w-10 h-10 bg-surface-200 rounded animate-pulse"></div>
                <div className="w-10 h-10 bg-surface-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-7 gap-4 mb-4">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="h-4 bg-surface-200 rounded animate-pulse"></div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-4">
              {[...Array(35)].map((_, i) => (
                <div key={i} className="h-20 bg-surface-200 rounded animate-pulse"></div>
              ))}
            </div>
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
          <h3 className="text-lg font-semibold text-surface-900 mb-2">Failed to load calendar</h3>
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

  return (
    <div className="p-6 max-w-full overflow-hidden">
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-surface-900">Purchase Calendar</h1>
        <p className="text-surface-600 mt-1">View your lifetime deal purchases by date</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-elevation-1"
          >
            {/* Calendar Header */}
            <div className="p-6 border-b border-surface-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-display font-semibold text-surface-900">
                  {format(currentDate, 'MMMM yyyy')}
                </h2>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigateMonth(-1)}
                    className="p-2 text-surface-600 hover:text-surface-900 hover:bg-surface-100 rounded-lg transition-colors"
                  >
                    <ApperIcon name="ChevronLeft" size={20} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigateMonth(1)}
                    className="p-2 text-surface-600 hover:text-surface-900 hover:bg-surface-100 rounded-lg transition-colors"
                  >
                    <ApperIcon name="ChevronRight" size={20} />
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="p-6">
              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-sm font-medium text-surface-600 py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-2">
                {daysInMonth.map((date, index) => {
                  const dealsOnDate = getDealsForDate(date);
                  const totalSpent = getTotalSpentOnDate(date);
                  const isSelected = selectedDate && isSameDay(date, selectedDate);
                  
                  return (
                    <motion.div
                      key={date.toISOString()}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.01 }}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setSelectedDate(date)}
                      className={`relative h-20 p-2 border border-surface-200 rounded-lg cursor-pointer transition-all min-w-0 ${
                        isSelected 
                          ? 'bg-primary/10 border-primary' 
                          : 'hover:bg-surface-50'
                      } ${
                        !isSameMonth(date, currentDate) ? 'opacity-50' : ''
                      }`}
                    >
                      <div className="text-sm font-medium text-surface-900">
                        {format(date, 'd')}
                      </div>
                      
                      {dealsOnDate.length > 0 && (
                        <div className="absolute bottom-2 left-2 right-2">
                          <div className="flex items-center justify-between">
                            <div
                              className={`bg-primary rounded-full ${getDotSize(totalSpent)}`}
                              title={`$${totalSpent.toFixed(2)} spent`}
                            />
                            <div className="text-xs text-surface-600 break-words">
                              ${totalSpent.toFixed(0)}
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Details Panel */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-elevation-1 h-fit"
          >
            <div className="p-6">
              <h3 className="text-lg font-display font-semibold text-surface-900 mb-4">
                {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
              </h3>
              
              {selectedDate ? (
                <div className="space-y-4">
                  {getDealsForDate(selectedDate).length > 0 ? (
                    <>
                      <div className="p-4 bg-surface-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-surface-700">Total Spent</span>
                          <span className="font-semibold text-surface-900">
                            ${getTotalSpentOnDate(selectedDate).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-sm font-medium text-surface-700">Deals</span>
                          <span className="font-semibold text-surface-900">
                            {getDealsForDate(selectedDate).length}
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        {getDealsForDate(selectedDate).map(deal => (
                          <motion.div
                            key={deal.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-3 border border-surface-200 rounded-lg hover:border-surface-300 transition-colors"
                          >
                            <div className="flex items-start justify-between">
                              <div className="min-w-0 flex-1">
                                <h4 className="font-medium text-surface-900 break-words">{deal.name}</h4>
                                <p className="text-sm text-surface-600">{deal.seller}</p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  <span className="inline-block px-2 py-1 text-xs bg-surface-100 text-surface-700 rounded">
                                    {deal.category}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-3 text-right">
                                <span className="font-semibold text-surface-900">${deal.amount.toFixed(2)}</span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <ApperIcon name="Calendar" className="w-12 h-12 text-surface-300 mx-auto mb-3" />
                      <p className="text-surface-600">No deals purchased on this date</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ApperIcon name="Calendar" className="w-12 h-12 text-surface-300 mx-auto mb-3" />
                  <p className="text-surface-600">Click on a date to view deal details</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;