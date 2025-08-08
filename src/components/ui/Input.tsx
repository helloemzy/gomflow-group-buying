import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, success, loading, leftIcon, rightIcon, className = '', ...props }, ref) => {
    const baseClasses = 'w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-4';
    
    const stateClasses = {
      default: 'border-gray-200 focus:border-emerald-500 focus:ring-emerald-50',
      error: 'border-red-500 focus:border-red-500 focus:ring-red-50',
      success: 'border-emerald-500 focus:border-emerald-500 focus:ring-emerald-50',
    };
    
    const getStateClass = () => {
      if (error) return stateClasses.error;
      if (success) return stateClasses.success;
      return stateClasses.default;
    };
    
    const classes = `${baseClasses} ${getStateClass()} ${className}`;
    
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}
          
          <motion.input
            ref={ref}
            className={`${classes} ${leftIcon ? 'pl-10' : ''} ${rightIcon || loading ? 'pr-10' : ''}`}
            whileFocus={{ scale: 1.01 }}
            {...props}
          />
          
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {loading && (
              <Loader2 className="w-5 h-5 text-emerald-500 animate-spin" />
            )}
            {success && !loading && (
              <CheckCircle className="w-5 h-5 text-emerald-500" />
            )}
            {error && !loading && (
              <AlertCircle className="w-5 h-5 text-red-500" />
            )}
            {rightIcon && !loading && !success && !error && (
              <div className="text-gray-400">
                {rightIcon}
              </div>
            )}
          </div>
        </div>
        
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-red-600 flex items-center gap-1"
          >
            <AlertCircle className="w-4 h-4" />
            {error}
          </motion.p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
