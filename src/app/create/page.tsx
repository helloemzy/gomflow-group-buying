'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import CreationForm from '@/components/forms/CreationForm';
import GroupBuyPreview from '@/components/forms/GroupBuyPreview';
import { useAppStore } from '@/lib/store';

const CreatePage: React.FC = () => {
  const { 
    creationForm, 
    detectedProduct, 
    isLoading, 
    setIsLoading
  } = useAppStore();

  const handlePublish = async () => {
    if (!detectedProduct || !creationForm.title) {
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate a mock slug
    const slug = `group-buy-${Date.now()}`;
    
    // In a real app, this would create the group buy in the database
    console.log('Publishing group buy:', { ...creationForm, slug });
    
    setIsLoading(false);
    
    // Show success state
    // In a real app, this would redirect to the group buy page
    alert('Group buy created successfully! (This is a demo)');
  };

  const canPublish = detectedProduct && creationForm.title && creationForm.product_url;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link 
                href="/"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-lg font-semibold text-gray-900">
                Create Group Buy
              </h1>
            </div>
            
            <Button
              onClick={handlePublish}
              disabled={!canPublish}
              loading={isLoading}
              size="lg"
            >
              {isLoading ? 'Publishing...' : 'Publish Group Buy'}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-12rem)]">
          {/* Form Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg border border-gray-200 p-6 overflow-y-auto"
          >
            <CreationForm />
          </motion.div>

          {/* Preview Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-lg border border-gray-200 p-6 overflow-y-auto"
          >
            <GroupBuyPreview />
          </motion.div>
        </div>

        {/* Mobile Notice */}
        <div className="lg:hidden mt-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 text-xs font-bold">💡</span>
              </div>
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Desktop Experience</h4>
                <p className="text-sm text-blue-700">
                  For the best experience creating group buys, try using a desktop computer. 
                  You&apos;ll see a live preview of your group buy as you create it.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePage;
