import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, DollarSign, TrendingUp, TrendingDown, Target } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import Button from '@/components/ui/Button';

const PricingAIModal: React.FC = () => {
  const { pricingAI, setPricingAI } = useAppStore();

  const handleClose = () => {
    setPricingAI({ isOpen: false });
  };

  const handleApplyRecommendation = () => {
    if (pricingAI.response?.recommendedPrice) {
      // Update the form with the recommended price
      // This would be handled by the parent component
      handleClose();
    }
  };

  if (!pricingAI.isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">AI Pricing Assistant</h2>
                <p className="text-sm text-gray-600">Optimize your pricing strategy</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {pricingAI.isLoading ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Analyzing your pricing...</h3>
                <p className="text-gray-600">Our AI is considering market conditions, competition, and demand patterns.</p>
              </div>
            ) : pricingAI.response ? (
              <div className="space-y-6">
                {/* Recommendation */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="w-5 h-5 text-emerald-600" />
                    <h3 className="font-semibold text-emerald-900">Recommended Price</h3>
                  </div>
                  <div className="text-2xl font-bold text-emerald-600 mb-2">
                    ${pricingAI.response.recommendedPrice?.toFixed(2)}
                  </div>
                  <p className="text-sm text-emerald-700">
                    This price balances profitability with market appeal
                  </p>
                </div>

                {/* Price Analysis */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingDown className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">Conservative</span>
                    </div>
                    <div className="text-lg font-semibold text-blue-600">
                      ${pricingAI.response.pricePoints?.conservative?.toFixed(2)}
                    </div>
                    <p className="text-xs text-blue-700">10% margin</p>
                  </div>

                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm font-medium text-emerald-900">Balanced</span>
                    </div>
                    <div className="text-lg font-semibold text-emerald-600">
                      ${pricingAI.response.pricePoints?.balanced?.toFixed(2)}
                    </div>
                    <p className="text-xs text-emerald-700">15% margin</p>
                  </div>

                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-orange-600" />
                      <span className="text-sm font-medium text-orange-900">Aggressive</span>
                    </div>
                    <div className="text-lg font-semibold text-orange-600">
                      ${pricingAI.response.pricePoints?.aggressive?.toFixed(2)}
                    </div>
                    <p className="text-xs text-orange-700">20% margin</p>
                  </div>
                </div>

                {/* Reasoning */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Analysis</h3>
                  <div className="text-sm text-gray-700 whitespace-pre-line">
                    {pricingAI.response.reasoning}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleApplyRecommendation}
                    className="flex-1"
                  >
                    Apply Recommendation
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={handleClose}
                    className="flex-1"
                  >
                    Keep Current Price
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <X className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Analysis Failed</h3>
                <p className="text-gray-600">Unable to analyze pricing. Please try again.</p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PricingAIModal;
