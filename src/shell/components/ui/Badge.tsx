interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'accent' | 'success' | 'warning' | 'danger'
  className?: string
}

const variantStyles = {
  default: 'bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300',
  accent: 'bg-orange-500 text-white dark:text-black',
  success: 'bg-green-600 text-white',
  warning: 'bg-amber-500 text-black',
  danger: 'bg-red-600 text-white',
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center h-5 px-1.5
        font-mono text-[10px] font-bold uppercase tracking-wide
        rounded-none
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  )
}
