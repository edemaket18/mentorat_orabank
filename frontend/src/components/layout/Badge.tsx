 import React from 'react';

 


export interface BadgeProps {
  variant?: 'default' | 'outline' | 'secondary' | 'destructive';
  children: React.ReactNode;
  className?: string;
}


 
 


export const Badge: React.FC<BadgeProps> = ({ variant = 'default', children, className }) => {
  const baseStyles = 'inline-flex items-center px-2 py-1 text-xs font-medium rounded-full';
  const variantStyles = {
    default: 'text-gray-800 bg-gray-100',
    outline: 'text-gray-800 border border-gray-300',
    secondary: 'text-gray-800 bg-gray-200',
  };

  return (
    <span className={`${baseStyles} ${variantStyles.default} ${className}`}>
      {children}
    </span>
  );
};



 

 


export default Badge;
