import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, Edit3, Globe, DollarSign, Truck, Sparkles } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import UrlInput from './UrlInput';
import PricingAIModal from '@/components/ai/PricingAIModal';
import ShippingAIModal from '@/components/ai/ShippingAIModal';
import { useAppStore } from '@/lib/store';
import { getAllCountries, PRODUCT_CATEGORIES, DEFAULT_VALUES } from '@/lib/constants';
import { CountryCode } from '@/types';

const CreationForm: React.FC = () => {
  const { 
    creationForm, 
    setCreationForm, 
    setPricingAI,
    setShippingAI
  } = useAppStore();

  const handleInputChange = (field: keyof typeof creationForm, value: string | number | string[]) => {
    setCreationForm({ [field]: value });
  };

  const handlePricingAI = async () => {
    if (!creationForm.individual_price || !creationForm.group_price) {
      alert('Please set both individual and group prices first');
      return;
    }

    setPricingAI({ 
      isOpen: true, 
      isLoading: true,
      request: {
        productCost: creationForm.individual_price,
        shippingCost: 0, // Will be calculated
        country: creationForm.country,
        minOrders: creationForm.min_orders,
        category: creationForm.category
      }
    });

    // Simulate AI call
    setTimeout(() => {
      setPricingAI({ 
        isLoading: false,
        response: {
          recommendedPrice: creationForm.group_price * 0.9,
          reasoning: "Based on market analysis, consider lowering the price by 10% for better appeal."
        }
      });
    }, 2000);
  };

  const handleShippingAI = async () => {
    setShippingAI({ 
      isOpen: true, 
      isLoading: true,
      request: {
        orders: [{ address: "Sample address", items: creationForm.min_orders }],
        country: creationForm.country,
        weight: 1000 // 1kg default
      }
    });

    // Simulate AI call
    setTimeout(() => {
      setShippingAI({ 
        isLoading: false,
        response: {
          providers: [
            { name: "Local Express", cost: 8.50, duration: "2-3 days", reliability: 0.95 }
          ],
          recommendations: "Consider bulk shipping for better rates."
        }
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Create Group Order</h2>
        
        <div className="space-y-6">
          {/* Country Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country
            </label>
            <div className="relative">
              <select
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 transition-all duration-200"
                value={creationForm.country}
                onChange={(e) => handleInputChange('country', e.target.value as CountryCode)}
              >
                {getAllCountries().map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.flag} {country.name}
                  </option>
                ))}
              </select>
              <Globe className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* URL Input */}
          <UrlInput />
          
          {/* Title Input */}
          <Input
            label="Order Title"
            placeholder="Give your group order a catchy title"
            value={creationForm.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            leftIcon={<Edit3 className="w-5 h-5" />}
            maxLength={DEFAULT_VALUES.MAX_TITLE_LENGTH}
          />
          
          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 transition-all duration-200"
              value={creationForm.category || ''}
              onChange={(e) => handleInputChange('category', e.target.value || '')}
            >
              <option value="">Select a category</option>
              {PRODUCT_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          
          {/* Description Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 transition-all duration-200 resize-none"
              rows={3}
              placeholder="Tell people why they should join this group order..."
              value={creationForm.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              maxLength={DEFAULT_VALUES.MAX_DESCRIPTION_LENGTH}
            />
          </div>
          
          {/* Pricing Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Pricing</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePricingAI}
                disabled={!creationForm.individual_price || !creationForm.group_price}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                AI Pricing Assistant
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Individual Price"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={creationForm.individual_price || ''}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  handleInputChange('individual_price', isNaN(value) ? 0 : value);
                }}
                leftIcon={<DollarSign className="w-5 h-5" />}
              />
              
              <Input
                label="Group Price"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={creationForm.group_price || ''}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  handleInputChange('group_price', isNaN(value) ? 0 : value);
                }}
                leftIcon={<DollarSign className="w-5 h-5" />}
              />
            </div>
          </div>
          
          {/* Participants */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Capacity</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShippingAI}
                disabled={creationForm.min_orders < 1}
              >
                <Truck className="w-4 h-4 mr-2" />
                Shipping Optimizer
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Minimum Orders"
                type="number"
                min="1"
                max="1000"
                value={creationForm.min_orders}
                onChange={(e) => handleInputChange('min_orders', parseInt(e.target.value))}
                leftIcon={<Users className="w-5 h-5" />}
              />
              
              <Input
                label="Maximum Orders"
                type="number"
                min="1"
                max="1000"
                value={creationForm.max_orders}
                onChange={(e) => handleInputChange('max_orders', parseInt(e.target.value))}
                leftIcon={<Users className="w-5 h-5" />}
              />
            </div>
          </div>
          
          {/* Deadlines */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Order Deadline"
              type="date"
              value={creationForm.deadline}
              onChange={(e) => handleInputChange('deadline', e.target.value)}
              leftIcon={<Calendar className="w-5 h-5" />}
            />
            
            <Input
              label="Payment Deadline"
              type="date"
              value={creationForm.payment_deadline || ''}
              onChange={(e) => handleInputChange('payment_deadline', e.target.value || '')}
              leftIcon={<Calendar className="w-5 h-5" />}
            />
          </div>
          
          {/* Smart Defaults Info */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-50 border border-blue-200 rounded-lg p-4"
          >
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 text-xs font-bold">i</span>
              </div>
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Smart Defaults</h4>
                <p className="text-sm text-blue-700">
                  We&apos;ve set reasonable defaults for your group order. You can adjust these anytime.
                  Use the AI assistants to optimize pricing and shipping.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* AI Modals */}
      <PricingAIModal />
      <ShippingAIModal />
    </div>
  );
};

export default CreationForm;
