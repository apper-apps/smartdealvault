import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { dealService } from '../services';
import ApperIcon from '../components/ApperIcon';
import AddDealModal from '../components/AddDealModal';

const AllDeals = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeller, setFilterSeller] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [editingDeal, setEditingDeal] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await dealService.getAll();
        setDeals(result);
      } catch (err) {
        setError(err.message || 'Failed to load deals');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleDelete = async (dealId) => {
    if (window.confirm('Are you sure you want to delete this deal?')) {
      try {
        await dealService.delete(dealId);
        setDeals(deals.filter(deal => deal.id !== dealId));
        toast.success('Deal deleted successfully!');
      } catch (error) {
        toast.error('Failed to delete deal');
      }
    }
  };

  const handleEdit = (deal) => {
    setEditingDeal(deal);
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setEditingDeal(null);
    setIsEditModalOpen(false);
    // Reload data after edit
    window.location.reload();
  };

  // Get unique sellers and categories for filters
  const uniqueSellers = [...new Set(deals.map(deal => deal.seller))].sort();
  const uniqueCategories = [...new Set(deals.map(deal => deal.category))].sort();

  // Filter and sort deals
  const filteredDeals = deals
    .filter(deal => {
      const matchesSearch = deal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           deal.seller.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           deal.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSeller = !filterSeller || deal.seller === filterSeller;
      const matchesCategory = !filterCategory || deal.category === filterCategory;
      
      return matchesSearch && matchesSeller && matchesCategory;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'amount':
          aValue = a.amount;
          bValue = b.amount;
          break;
        case 'date':
          aValue = new Date(a.purchaseDate);
          bValue = new Date(b.purchaseDate);
          break;
        case 'seller':
          aValue = a.seller.toLowerCase();
          bValue = b.seller.toLowerCase();
          break;
        default:
          return 0;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <div className="h-8 bg-surface-200 rounded w-48 animate-pulse mb-4"></div>
          <div className="flex gap-4 mb-4">
            <div className="h-10 bg-surface-200 rounded w-64 animate-pulse"></div>
            <div className="h-10 bg-surface-200 rounded w-32 animate-pulse"></div>
            <div className="h-10 bg-surface-200 rounded w-32 animate-pulse"></div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-elevation-1">
          <div className="p-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 border-b border-surface-200 last:border-b-0">
                <div className="animate-pulse flex items-center gap-4 flex-1">
                  <div className="w-10 h-10 bg-surface-200 rounded-lg"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-surface-200 rounded w-1/4"></div>
                    <div className="h-3 bg-surface-200 rounded w-1/6"></div>
                  </div>
                  <div className="h-4 bg-surface-200 rounded w-16"></div>
                </div>
              </div>
            ))}
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
          <h3 className="text-lg font-semibold text-surface-900 mb-2">Failed to load deals</h3>
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

  if (deals.length === 0) {
    return (
      <div className="p-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-xl p-12 shadow-elevation-1 text-center"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <ApperIcon name="Package" className="w-16 h-16 text-surface-300 mx-auto" />
          </motion.div>
          <h3 className="mt-4 text-xl font-display font-semibold text-surface-900">
            No deals found
          </h3>
          <p className="mt-2 text-surface-600 max-w-md mx-auto">
            Start tracking your lifetime deal investments by adding your first purchase. Use the "Add LTD" button to get started.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-full overflow-hidden">
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-surface-900">All Deals</h1>
        <p className="text-surface-600 mt-1">Manage and view all your lifetime deal purchases</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" size={16} />
              <input
                type="text"
                placeholder="Search deals, sellers, or categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              />
            </div>
          </div>
          
          <select
            value={filterSeller}
            onChange={(e) => setFilterSeller(e.target.value)}
            className="px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
          >
            <option value="">All Sellers</option>
            {uniqueSellers.map(seller => (
              <option key={seller} value={seller}>{seller}</option>
            ))}
          </select>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
          >
            <option value="">All Categories</option>
            {uniqueCategories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field);
              setSortOrder(order);
            }}
            className="px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
          >
            <option value="date-desc">Date (Newest)</option>
            <option value="date-asc">Date (Oldest)</option>
            <option value="amount-desc">Amount (High to Low)</option>
            <option value="amount-asc">Amount (Low to High)</option>
            <option value="name-asc">Name (A to Z)</option>
            <option value="name-desc">Name (Z to A)</option>
            <option value="seller-asc">Seller (A to Z)</option>
          </select>
        </div>

        {(searchTerm || filterSeller || filterCategory) && (
          <div className="flex items-center gap-2 text-sm text-surface-600">
            <span>Showing {filteredDeals.length} of {deals.length} deals</span>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterSeller('');
                setFilterCategory('');
              }}
              className="text-primary hover:text-indigo-700 font-medium"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Deals Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-elevation-1 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-50 border-b border-surface-200">
              <tr>
                <th className="text-left p-4 font-medium text-surface-700">Deal</th>
                <th className="text-left p-4 font-medium text-surface-700">Amount</th>
                <th className="text-left p-4 font-medium text-surface-700">Date</th>
                <th className="text-left p-4 font-medium text-surface-700">Seller</th>
                <th className="text-left p-4 font-medium text-surface-700">Category</th>
                <th className="text-right p-4 font-medium text-surface-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDeals.map((deal, index) => (
                <motion.tr
                  key={deal.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-surface-100 hover:bg-surface-50 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                        <ApperIcon name="Package" className="w-5 h-5 text-white" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-medium text-surface-900 break-words">{deal.name}</h3>
                        {deal.tags && deal.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {deal.tags.slice(0, 2).map(tag => (
                              <span key={tag} className="inline-block px-2 py-1 text-xs bg-surface-100 text-surface-700 rounded">
                                {tag}
                              </span>
                            ))}
                            {deal.tags.length > 2 && (
                              <span className="text-xs text-surface-500">+{deal.tags.length - 2}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-semibold text-surface-900">${deal.amount.toFixed(2)}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-surface-700">
                      {new Date(deal.purchaseDate).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-surface-700">{deal.seller}</span>
                  </td>
                  <td className="p-4">
                    <span className="inline-block px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">
                      {deal.category}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleEdit(deal)}
                        className="p-2 text-surface-600 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        title="Edit deal"
                      >
                        <ApperIcon name="Edit2" size={16} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDelete(deal.id)}
                        className="p-2 text-surface-600 hover:text-error hover:bg-error/10 rounded-lg transition-colors"
                        title="Delete deal"
                      >
                        <ApperIcon name="Trash2" size={16} />
                      </motion.button>
</div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Edit Modal */}
      <AddDealModal
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
        dealToEdit={editingDeal}
      />
    </div>
  );
};

export default AllDeals;