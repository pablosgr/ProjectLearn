import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'cancel';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
}

export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  isLoading = false,
  className = '',
}: ButtonProps) {
  const baseStyles = 'rounded-md font-medium transition-colors';
  
  const variantStyles = {
    primary: 'bg-cyan-600 text-white hover:bg-cyan-700 hover:cursor-pointer',
    secondary: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
    cancel: 'border border-gray-300 text-gray-700 hover:bg-neutral-200 hover:cursor-pointer',
  };
  
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };
  
  const disabledStyles = disabled || isLoading ? 'opacity-70 cursor-not-allowed' : '';
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles} ${className}`}
    >
      {isLoading ? ' Saving..' : children}
    </button>
  );
}
