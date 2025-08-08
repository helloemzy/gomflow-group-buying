import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading = false, children, className = '', disabled, ...props }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-emerald-50';
    
    const variants = {
      primary: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm hover:shadow-md disabled:bg-gray-300 disabled:cursor-not-allowed',
      secondary: 'bg-white text-gray-900 border-2 border-gray-200 hover:border-emerald-500 hover:text-emerald-600 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed',
      outline: 'bg-transparent text-emerald-600 border-2 border-emerald-600 hover:bg-emerald-600 hover:text-white disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed',
      ghost: 'bg-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed',
    };
    
    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    };
    
    const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;
    
    return (
      <motion.button
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
        {...props}
      >
        {loading && (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        )}
        {children}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
