 
 
 import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'outline'; // Ajout de outline
  fullWidth?: boolean;
  icon?: React.ReactNode;  
  isLoading?: boolean;   
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  className,
  disabled,
  type = 'button',
  size = 'md',
  variant = 'primary',
  fullWidth,
  icon,
  isLoading, 
                     

}) => {
  let sizeClass = 'py-2 px-4';
  switch (size) {
    case 'sm':
      sizeClass = 'py-1 px-2 text-sm';
      break;
    case 'lg':
      sizeClass = 'py-3 px-6 text-lg';
      break;
  }

  let variantClass = 'bg-blue-500 hover:bg-blue-700 text-white';
  switch (variant) {
    case 'secondary':
      variantClass = 'bg-gray-500 hover:bg-gray-700 text-white';
      break;
    case 'outline': // Style pour les boutons "outline"
      variantClass = 'border border-blue-500 text-blue-500 hover:bg-blue-50 hover:text-blue-700';
      break;
 
       
 }

  return (
    <button
      className={`font-bold rounded focus:outline-none focus:shadow-outline ${sizeClass} ${variantClass} ${className || ''} ${fullWidth ? 'w-full' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {isLoading ? (
        <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">  
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
      ) : icon && (
        <span className="mr-2">{icon}</span> // Affiche l'icône si elle est fournie
      )}
      {children}
    </button>
  );
};

export default Button;
 

/*
// Button.tsx
import React from 'react';
import clsx from 'clsx';

type Variant = 'primary' | 'secondary' | 'outline';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

const variantClasses: Record<Variant, string> = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700',
  secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
  outline: 'border border-gray-400 text-gray-700 hover:bg-gray-100',
};

const Button: React.FC<ButtonProps> = ({ variant = 'primary', className, ...props }) => {
  return (
    <button
      className={clsx(
        'px-4 py-2 rounded transition-colors duration-200 focus:outline-none',
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
};

export default Button;

*/