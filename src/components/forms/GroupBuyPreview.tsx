import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users } from 'lucide-react';
import { useAppStore } from '@/lib/store';

const GroupBuyPreview: React.FC = () => {
  const { creationForm, detectedProduct, previewMode } = useAppStore();

  const calculateSavings = () => {
    if (!detectedProduct) return { individual: 0, total: 0 };
    
    const individualShipping = detectedProduct.shipping_cost;
    const totalShipping = individualShipping * creationForm.min_participants;
    const savingsPerPerson = individualShipping - (totalShipping / creationForm.min_participants);
    
    return {
      individual: Math.round(savingsPerPerson * 100) / 100,
      total: Math.round(savingsPerPerson * creationForm.min_participants * 100) / 100
    };
  };

  const savings = calculateSavings();
  const deadline = new Date(creationForm.deadline);
  const daysLeft = Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Preview</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => useAppStore.getState().setPreviewMode('desktop')}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              previewMode === 'desktop' 
                ? 'bg-emerald-100 text-emerald-700' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Desktop
          </button>
          <button
            onClick={() => useAppStore.getState().setPreviewMode('mobile')}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              previewMode === 'mobile' 
                ? 'bg-emerald-100 text-emerald-700' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Mobile
          </button>
        </div>
      </div>

      <div className={`flex-1 bg-gray-100 rounded-lg p-4 overflow-auto ${
        previewMode === 'mobile' ? 'max-w-sm mx-auto' : ''
      }`}>
        <div className={`bg-white rounded-lg shadow-sm ${
          previewMode === 'mobile' ? 'max-w-sm' : ''
        }`}>
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-start gap-4">
              {detectedProduct?.images[0] && (
                <img 
                  src={detectedProduct.images[0]} 
                  alt={detectedProduct.title}
                  className="w-20 h-20 object-cover rounded-lg"
                />
              )}
              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-bold text-gray-900 mb-2">
                  {creationForm.title || 'Group Buy Title'}
                </h1>
                {creationForm.description && (
                  <p className="text-gray-600 text-sm mb-3">
                    {creationForm.description}
                  </p>
                )}
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{daysLeft} days left</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{creationForm.min_participants} needed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details */}
          {detectedProduct && (
            <div className="p-6 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">Product Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Price</span>
                  <span className="font-semibold text-gray-900">
                    ${detectedProduct.price}
                    {detectedProduct.original_price && (
                      <span className="text-gray-500 line-through ml-2">
                        ${detectedProduct.original_price}
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Shipping (individual)</span>
                  <span className="font-semibold text-gray-900">
                    ${detectedProduct.shipping_cost}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Retailer</span>
                  <span className="font-semibold text-gray-900">
                    {detectedProduct.retailer}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Savings Breakdown */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3">Savings Breakdown</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Individual shipping cost</span>
                <span className="font-semibold text-gray-900">
                  ${detectedProduct?.shipping_cost || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Shared shipping cost</span>
                <span className="font-semibold text-gray-900">
                  ${detectedProduct ? (detectedProduct.shipping_cost / creationForm.min_participants).toFixed(2) : 0}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                <span className="text-emerald-600 font-semibold">You save</span>
                <span className="text-emerald-600 font-bold text-lg">
                  ${savings.individual}
                </span>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="p-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Progress</span>
              <span className="text-sm font-semibold text-gray-900">
                0 / {creationForm.min_participants} joined
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div 
                className="bg-emerald-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: '0%' }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Need {creationForm.min_participants} more people to join
            </p>
          </div>

          {/* Action Button */}
          <div className="p-6 pt-0">
            <motion.button
              className="w-full bg-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Join Group Buy
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupBuyPreview;
