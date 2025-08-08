import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hover = true, 
  padding = 'md',
  onClick 
}) => {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };
  
  const baseClasses = `bg-white rounded-lg border border-gray-200 ${paddingClasses[padding]} ${className}`;
  const hoverClasses = hover ? 'hover:shadow-lg transition-shadow duration-200' : '';
  const clickClasses = onClick ? 'cursor-pointer' : '';
  
  const classes = `${baseClasses} ${hoverClasses} ${clickClasses}`;
  
  const Component = onClick ? motion.div : motion.div;
  const motionProps = onClick ? {
    whileHover: { scale: 1.01 },
    whileTap: { scale: 0.99 },
    onClick,
  } : {};
  
  return (
    <Component className={classes} {...motionProps}>
      {children}
    </Component>
  );
};

export default Card;
