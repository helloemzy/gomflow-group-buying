import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, Edit3 } from 'lucide-react';
import Input from '@/components/ui/Input';
import UrlInput from './UrlInput';
import { useAppStore } from '@/lib/store';

const CreationForm: React.FC = () => {
  const { creationForm, setCreationForm } = useAppStore();

  const handleInputChange = (field: keyof typeof creationForm, value: string | number) => {
    setCreationForm({ [field]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Create Group Buy</h2>
        
        <div className="space-y-6">
          {/* URL Input */}
          <UrlInput />
          
          {/* Title Input */}
          <Input
            label="Group Buy Title"
            placeholder="Give your group buy a catchy title"
            value={creationForm.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            leftIcon={<Edit3 className="w-5 h-5" />}
          />
          
          {/* Description Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 transition-all duration-200 resize-none"
              rows={3}
              placeholder="Tell people why they should join this group buy..."
              value={creationForm.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
            />
          </div>
          
          {/* Participants */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Minimum Participants"
              type="number"
              min="2"
              max="100"
              value={creationForm.min_participants}
              onChange={(e) => handleInputChange('min_participants', parseInt(e.target.value))}
              leftIcon={<Users className="w-5 h-5" />}
            />
            
            <Input
              label="Maximum Participants"
              type="number"
              min="2"
              max="200"
              value={creationForm.max_participants}
              onChange={(e) => handleInputChange('max_participants', parseInt(e.target.value))}
              leftIcon={<Users className="w-5 h-5" />}
            />
          </div>
          
          {/* Deadline */}
          <Input
            label="Deadline"
            type="date"
            value={creationForm.deadline}
            onChange={(e) => handleInputChange('deadline', e.target.value)}
            leftIcon={<Calendar className="w-5 h-5" />}
          />
          
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
                  We&apos;ve set reasonable defaults for your group buy. You can adjust these anytime.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CreationForm;
