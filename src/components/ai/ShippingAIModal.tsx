import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Truck, 
  Package, 
  MapPin, 
  Clock, 
  DollarSign,
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { ShippingRequest } from '@/types';
import { getShippingRecommendation } from '@/lib/ai/shipping-agent';
import { formatCurrency } from '@/lib/constants';
import Button from '@/components/ui/Button';

const ShippingAIModal: React.FC = () => {
  const { shippingAI, setShippingAI } = useAppStore();
  const [formData, setFormData] = useState({
    weight: '',
    orders: [{ address: '', items: '' }]
  });

  const handleClose = () => {
    setShippingAI({ isOpen: false });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const request: ShippingRequest = {
      orders: formData.orders.map(order => ({
        address: order.address,
        items: parseInt(order.items) || 1
      })),
      country: 'US', // This should come from the order context
      weight: parseFloat(formData.weight) || 1000
    };

    setShippingAI({ isLoading: true, request });

    try {
      const response = await getShippingRecommendation(request);
      setShippingAI({ 
        isLoading: false, 
        response,
        error: null 
      });
    } catch {
      setShippingAI({ 
        isLoading: false, 
        error: 'Failed to get shipping recommendations' 
      });
    }
  };

  const addOrder = () => {
    setFormData(prev => ({
      ...prev,
      orders: [...prev.orders, { address: '', items: '' }]
    }));
  };

  const removeOrder = (index: number) => {
    if (formData.orders.length > 1) {
      setFormData(prev => ({
        ...prev,
        orders: prev.orders.filter((_, i) => i !== index)
      }));
    }
  };

  const updateOrder = (index: number, field: 'address' | 'items', value: string) => {
    setFormData(prev => ({
      ...prev,
      orders: prev.orders.map((order, i) => 
        i === index ? { ...order, [field]: value } : order
      )
    }));
  };

  const getReliabilityColor = (reliability: number) => {
    if (reliability >= 0.95) return 'text-emerald-600';
    if (reliability >= 0.90) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getReliabilityIcon = (reliability: number) => {
    if (reliability >= 0.95) return <CheckCircle className="w-4 h-4 text-emerald-600" />;
    if (reliability >= 0.90) return <AlertCircle className="w-4 h-4 text-yellow-600" />;
    return <AlertCircle className="w-4 h-4 text-red-600" />;
  };

  return (
    <>
      {shippingAI.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Truck className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Shipping AI Assistant</h3>
                  <p className="text-sm text-gray-600">Get optimized shipping recommendations</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {!shippingAI.response ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Weight Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Package Weight (grams)
                    </label>
                    <div className="relative">
                      <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        value={formData.weight}
                        onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="1000"
                        required
                      />
                    </div>
                  </div>

                  {/* Orders */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Shipping Addresses
                    </label>
                    <div className="space-y-3">
                      {formData.orders.map((order, index) => (
                        <div key={index} className="flex gap-3">
                          <div className="flex-1">
                            <div className="relative">
                              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                              <input
                                type="text"
                                value={order.address}
                                onChange={(e) => updateOrder(index, 'address', e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter shipping address"
                                required
                              />
                            </div>
                          </div>
                          <div className="w-24">
                            <div className="relative">
                              <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <input
                                type="number"
                                value={order.items}
                                onChange={(e) => updateOrder(index, 'items', e.target.value)}
                                className="w-full pl-8 pr-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Qty"
                                min="1"
                                required
                              />
                            </div>
                          </div>
                          {formData.orders.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeOrder(index)}
                              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={addOrder}
                      className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      + Add another address
                    </button>
                  </div>

                  {/* Submit */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      type="submit"
                      className="flex-1"
                      loading={shippingAI.isLoading}
                    >
                      Get Recommendations
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleClose}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  {/* Recommendations */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Shipping Providers</h4>
                    <div className="space-y-3">
                      {shippingAI.response.providers.map((provider, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium text-gray-900">{provider.name}</h5>
                            <div className="flex items-center gap-2">
                              {getReliabilityIcon(provider.reliability)}
                              <span className={`text-sm font-medium ${getReliabilityColor(provider.reliability)}`}>
                                {(provider.reliability * 100).toFixed(0)}%
                              </span>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4 text-gray-400" />
                              <span className="font-medium">{formatCurrency(provider.cost, 'US')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span>{provider.duration}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Truck className="w-4 h-4 text-gray-400" />
                              <span>Reliable</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bulk Discounts */}
                  {shippingAI.response.bulkDiscounts.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">Bulk Shipping Discounts</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {shippingAI.response.bulkDiscounts.map((discount, index) => (
                          <div key={index} className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                            <div className="text-center">
                              <p className="text-lg font-bold text-emerald-600">
                                {discount.discount * 100}% OFF
                              </p>
                              <p className="text-sm text-emerald-700">
                                {discount.quantity}+ orders
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* AI Recommendations */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">AI Recommendations</h4>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <pre className="text-sm text-blue-900 whitespace-pre-wrap">
                        {shippingAI.response.recommendations}
                      </pre>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={() => setShippingAI({ response: null })}
                      className="flex-1"
                    >
                      Get New Recommendations
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleClose}
                    >
                      Close
                    </Button>
                  </div>
                </div>
              )}

              {shippingAI.error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-600">{shippingAI.error}</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default ShippingAIModal;
