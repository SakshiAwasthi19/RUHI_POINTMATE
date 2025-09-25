import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  icon?: React.ReactNode; // Add icon prop for backward compatibility
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  fullWidth = false,
  leftIcon,
  rightIcon,
  icon, // Destructure icon prop
  className = '',
  id,
  ...props
}) => {
  // Use icon as leftIcon if provided and leftIcon is not explicitly set
  const effectiveLeftIcon = leftIcon || icon;
  const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;
  
  const baseClasses = 'appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 text-sm';
  const errorClasses = error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : '';
  const widthClass = fullWidth ? 'w-full' : '';
  const iconPaddingLeft = leftIcon ? 'pl-10' : '';
  const iconPaddingRight = rightIcon ? 'pr-10' : '';
  
  return (
    <div className={`${widthClass} ${className}`}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      
      <div className="relative rounded-md shadow-sm">
        {effectiveLeftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            {effectiveLeftIcon}
          </div>
        )}
        
        <input
          id={inputId}
          className={`${baseClasses} ${errorClasses} ${widthClass} ${iconPaddingLeft} ${iconPaddingRight}`}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
            {rightIcon}
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Input;