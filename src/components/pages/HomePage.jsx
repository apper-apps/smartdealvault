import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import ApperIcon from '../ApperIcon';
import AddDealModal from '../AddDealModal';
import ContactForm from '../organisms/ContactForm';
import dealService from '../../services/api/dealService';

function HomePage() {
  const [showModal, setShowModal] = useState(false);
  const [deals, setDeals] = useState([]);
  const contactFormRef = useRef(null);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const data = await dealService.getAllDeals();
        setDeals(data);
      } catch (error) {
        toast.error('Failed to fetch deals.');
        console.error('Error fetching deals:', error);
      }
    };

    fetchDeals();
  }, []);

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleAddDeal = (newDeal) => {
    setDeals((prevDeals) => [...prevDeals, newDeal]);
    toast.success('Deal added successfully!');
    handleCloseModal();
  };

  const handleContactFormClear = () => {
    if (contactFormRef.current) {
      contactFormRef.current.clearForm();
      toast.info('Contact form cleared!');
    }
  };

  return (
    <div className="flex flex-col flex-1 p-4 overflow-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Welcome to Apper!</h1>
        <ApperIcon className="w-12 h-12 text-blue-600" />
      </div>

      <p className="mb-8 text-gray-600">
        Apper helps you manage your deals and connect with clients efficiently.
        Use the features below to get started.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Quick Actions</h2>
          <div className="space-y-4">
            <button
              onClick={handleShowModal}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out text-lg font-medium"
            >
              Add New Deal
            </button>
            <button
              onClick={handleContactFormClear}
              className="w-full bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition duration-300 ease-in-out text-lg font-medium"
            >
              Clear Contact Form
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Contact Us</h2>
          <ContactForm ref={contactFormRef} />
        </div>
      </div>

{deals.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your Recent Deals ({deals.length})</h2>
          <ul className="space-y-4">
            {deals.map((deal, index) => {
              // Log any malformed deal objects for debugging
              if (!deal || typeof deal !== 'object') {
                console.warn('Malformed deal object:', deal);
                return null;
              }
              
              return (
                <li key={deal?.id || `deal-${index}`} className="bg-gray-50 p-4 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-800">{deal?.title || 'Untitled Deal'}</h3>
                  <p className="text-gray-600">Client: {deal?.client || 'Unknown Client'}</p>
                  <p className="text-gray-600">
                    Value: {deal?.value != null ? `$${deal.value.toLocaleString()}` : 'N/A'}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {showModal && (
        <AddDealModal onClose={handleCloseModal} onAddDeal={handleAddDeal} />
      )}
    </div>
  );
}

export default HomePage;