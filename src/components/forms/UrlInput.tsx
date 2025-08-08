import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import Input from '@/components/ui/Input';
import { detectProduct } from '@/lib/productDetection';
import { useAppStore } from '@/lib/store';
import { Product } from '@/types';

const UrlInput: React.FC = () => {
  const { 
    creationForm, 
    setCreationForm, 
    detectedProduct, 
    setDetectedProduct, 
    isDetecting, 
    setIsDetecting, 
    detectionError, 
    setDetectionError 
  } = useAppStore();

  const [localUrl, setLocalUrl] = useState(creationForm.product_url);

  const handleUrlChange = useCallback(async (url: string) => {
    setLocalUrl(url);
    setCreationForm({ product_url: url });
    
    // Clear previous detection
    setDetectedProduct(null);
    setDetectionError(null);
    
    // Don't detect if URL is empty or too short
    if (!url || url.length < 10) {
      return;
    }

    // Add a small delay to avoid too many requests
    const timeoutId = setTimeout(async () => {
      if (url === localUrl) {
        setIsDetecting(true);
        
        try {
          const result = await detectProduct(url);
          
          if (result.success && result.product) {
            setDetectedProduct(result.product);
            setDetectionError(null);
            
            // Auto-fill title if empty
            if (!creationForm.title) {
              setCreationForm({ title: result.product.title });
            }
          } else {
            setDetectedProduct(null);
            setDetectionError(result.error || 'Failed to detect product');
          }
        } catch (error) {
          setDetectedProduct(null);
          setDetectionError('Failed to detect product');
        } finally {
          setIsDetecting(false);
        }
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [localUrl, creationForm.title, setCreationForm, setDetectedProduct, setDetectionError, setIsDetecting]);

  const getInputState = () => {
    if (isDetecting) return { loading: true };
    if (detectedProduct) return { success: true };
    if (detectionError) return { error: detectionError };
    return {};
  };

  const getRightIcon = () => {
    if (isDetecting) return <Loader2 className="w-5 h-5 animate-spin" />;
    if (detectedProduct) return <CheckCircle className="w-5 h-5 text-emerald-500" />;
    if (detectionError) return <AlertCircle className="w-5 h-5 text-red-500" />;
    return <Link className="w-5 h-5 text-gray-400" />;
  };

  return (
    <div className="space-y-4">
      <Input
        label="Product URL"
        placeholder="Paste a product link from Amazon, Walmart, Target, Costco, or Best Buy"
        value={localUrl}
        onChange={(e) => handleUrlChange(e.target.value)}
        leftIcon={<Link className="w-5 h-5" />}
        rightIcon={getRightIcon()}
        {...getInputState()}
      />
      
      <AnimatePresence>
        {detectedProduct && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="bg-emerald-50 border border-emerald-200 rounded-lg p-4"
          >
            <div className="flex items-start gap-3">
              {detectedProduct.images[0] && (
                <img 
                  src={detectedProduct.images[0]} 
                  alt={detectedProduct.title}
                  className="w-16 h-16 object-cover rounded-lg"
                />
              )}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 truncate">
                  {detectedProduct.title}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-lg font-bold text-emerald-600">
                    ${detectedProduct.price}
                  </span>
                  {detectedProduct.original_price && (
                    <span className="text-sm text-gray-500 line-through">
                      ${detectedProduct.original_price}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                  <span>{detectedProduct.retailer}</span>
                  {detectedProduct.shipping_cost > 0 && (
                    <>
                      <span>•</span>
                      <span>Shipping: ${detectedProduct.shipping_cost}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        {detectionError && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="bg-red-50 border border-red-200 rounded-lg p-4"
          >
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm">{detectionError}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UrlInput;
