import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from './ApperIcon';
import { dealService } from '../services';

const AddDealModal = ({ isOpen, onClose, dealToEdit = null }) => {
  const [formData, setFormData] = useState({
    name: dealToEdit?.name || '',
    amount: dealToEdit?.amount || '',
    purchaseDate: dealToEdit?.purchaseDate || new Date().toISOString().split('T')[0],
    seller: dealToEdit?.seller || '',
    category: dealToEdit?.category || '',
    tags: dealToEdit?.tags?.join(', ') || '',
    notes: dealToEdit?.notes || ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const sellers = [
    'AppSumo',
    'Prime Club',
    'StackSocial',
    'PitchGround',
    'SaaS Mantra',
    'Earlybird',
    'RocketHub'
  ];

  const categories = [
    'Design Tools',
    'Marketing',
    'Productivity',
    'Development',
    'Business',
    'Education',
    'Analytics',
    'Communication',
    'Finance',
    'Other'
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Deal name is required';
    if (!formData.amount || formData.amount <= 0) newErrors.amount = 'Valid amount is required';
    if (!formData.purchaseDate) newErrors.purchaseDate = 'Purchase date is required';
    if (!formData.seller) newErrors.seller = 'Seller is required';
    if (!formData.category) newErrors.category = 'Category is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const dealData = {
        ...formData,
        amount: parseFloat(formData.amount),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };
      
      if (dealToEdit) {
        await dealService.update(dealToEdit.id, dealData);
        toast.success('Deal updated successfully!');
      } else {
        await dealService.create(dealData);
        toast.success('Deal added successfully!');
      }
      
      handleClose();
      // Trigger a page reload to refresh data
      window.location.reload();
    } catch (error) {
      toast.error('Failed to save deal. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        name: '',
        amount: '',
        purchaseDate: new Date().toISOString().split('T')[0],
        seller: '',
        category: '',
        tags: '',
        notes: ''
      });
      setErrors({});
      onClose();
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={handleClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-display font-bold text-surface-900">
                    {dealToEdit ? 'Edit Deal' : 'Add New LTD'}
                  </h2>
                  <button
                    onClick={handleClose}
                    className="p-2 text-surface-400 hover:text-surface-600 hover:bg-surface-100 rounded-lg transition-colors"
                  >
                    <ApperIcon name="X" size={20} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Deal Name */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-surface-700 mb-2">
                        Deal Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${
                          errors.name ? 'border-error' : 'border-surface-300'
                        }`}
                        placeholder="Enter deal name"
                      />
                      {errors.name && <p className="mt-1 text-sm text-error">{errors.name}</p>}
                    </div>

                    {/* Amount */}
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-2">
                        Amount ($) *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.amount}
                        onChange={(e) => handleInputChange('amount', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${
                          errors.amount ? 'border-error' : 'border-surface-300'
                        }`}
                        placeholder="0.00"
                      />
                      {errors.amount && <p className="mt-1 text-sm text-error">{errors.amount}</p>}
                    </div>

                    {/* Purchase Date */}
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-2">
                        Purchase Date *
                      </label>
                      <input
                        type="date"
                        value={formData.purchaseDate}
                        onChange={(e) => handleInputChange('purchaseDate', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${
                          errors.purchaseDate ? 'border-error' : 'border-surface-300'
                        }`}
                      />
                      {errors.purchaseDate && <p className="mt-1 text-sm text-error">{errors.purchaseDate}</p>}
                    </div>

                    {/* Seller */}
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-2">
                        Seller *
                      </label>
                      <select
                        value={formData.seller}
                        onChange={(e) => handleInputChange('seller', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${
                          errors.seller ? 'border-error' : 'border-surface-300'
                        }`}
                      >
                        <option value="">Select seller</option>
                        {sellers.map(seller => (
                          <option key={seller} value={seller}>{seller}</option>
                        ))}
                      </select>
                      {errors.seller && <p className="mt-1 text-sm text-error">{errors.seller}</p>}
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-2">
                        Category *
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${
                          errors.category ? 'border-error' : 'border-surface-300'
                        }`}
                      >
                        <option value="">Select category</option>
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                      {errors.category && <p className="mt-1 text-sm text-error">{errors.category}</p>}
                    </div>

                    {/* Tags */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-surface-700 mb-2">
                        Tags
                      </label>
                      <input
                        type="text"
                        value={formData.tags}
                        onChange={(e) => handleInputChange('tags', e.target.value)}
                        className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                        placeholder="Separate tags with commas"
                      />
                      <p className="mt-1 text-xs text-surface-500">Example: design, graphics, templates</p>
                    </div>

                    {/* Notes */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-surface-700 mb-2">
                        Notes
                      </label>
                      <textarea
                        value={formData.notes}
                        onChange={(e) => handleInputChange('notes', e.target.value)}
                        rows="3"
                        className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors resize-none"
                        placeholder="Additional notes about this deal..."
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleClose}
                      className="flex-1 px-4 py-2 border border-surface-300 text-surface-700 rounded-lg hover:bg-surface-50 transition-colors"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 bg-primary hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                          Saving...
                        </div>
                      ) : (
                        dealToEdit ? 'Update Deal' : 'Add Deal'
                      )}
                    </motion.button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AddDealModal;