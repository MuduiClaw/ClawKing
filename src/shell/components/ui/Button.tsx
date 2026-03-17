import { type ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

const variantStyles = {
  primary:
    'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white hover:bg-neutral-800 dark:hover:bg-neutral-200',
  secondary:
    'bg-transparent text-black dark:text-white border-neutral-300 dark:border-neutral-800 hover:border-neutral-500 dark:hover:border-neutral-500',
  ghost:
    'bg-transparent text-neutral-500 border-transparent hover:text-black dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-900',
  danger:
    'bg-transparent text-red-600 dark:text-red-500 border-red-300 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-950',
}

const sizeStyles = {
  sm: 'h-7 px-2 text-xs',
  md: 'h-9 px-4 text-sm',
  lg: 'h-11 px-6 text-base',
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center
        font-mono font-medium uppercase tracking-wide
        border rounded-none
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
}
