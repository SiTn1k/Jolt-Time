import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export function Button({ children, className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`px-4 py-2 rounded-lg font-medium transition-all active:scale-[0.98] ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
