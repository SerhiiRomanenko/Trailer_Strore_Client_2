import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ variant = 'primary', children, className = '', ...props }) => {
  const baseStyles = "inline-flex items-center justify-center font-semibold py-3 px-6 rounded-lg transition-all duration-300 focus:outline-none focus:ring-4 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm hover:shadow-lg transform hover:-translate-y-0.5";

  const variantStyles = {
    primary: "bg-orange-500 text-white hover:bg-orange-600 focus:ring-orange-500/50",
    secondary: "bg-slate-200 text-slate-800 hover:bg-slate-300 focus:ring-slate-500/50",
    ghost: "bg-transparent text-slate-300 hover:bg-slate-700 hover:text-white"
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;