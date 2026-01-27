import React from 'react';
import { cn } from '@/lib/utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl';
  
  const variants = {
    primary:
      'bg-gradient-to-r from-[#ff3b5c] via-[#ff6b35] to-[#ffa500] text-white hover:shadow-2xl focus:ring-[#ff3b5c] transform hover:-translate-y-1 hover:scale-[1.02]',
    secondary:
      'bg-[var(--color-surface)] text-[var(--color-primary)] border-2 border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] hover:border-[var(--color-accent)] focus:ring-[var(--color-accent)] shadow-sm hover:shadow-lg',
    outline:
      'bg-transparent text-[var(--color-accent)] border-2 border-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-white focus:ring-[var(--color-accent)] hover:shadow-lg',
  };
  
  const sizes = {
    sm: 'px-5 py-2.5 text-sm',
    md: 'px-7 py-3.5 text-base',
    lg: 'px-9 py-4.5 text-lg',
  };
  
  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}
