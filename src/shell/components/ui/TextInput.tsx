import { type InputHTMLAttributes } from 'react'

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function TextInput({
  label,
  error,
  className = '',
  ...props
}: TextInputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="font-mono text-[11px] font-bold uppercase tracking-wider text-neutral-500">
          {label}
        </label>
      )}
      <input
        className={`
          h-9 px-3
          bg-neutral-200 dark:bg-neutral-900
          border rounded-none
          ${error
            ? 'border-red-500 dark:border-red-500'
            : 'border-neutral-300 dark:border-neutral-800 focus:border-neutral-500 dark:focus:border-neutral-500'
          }
          text-sm text-black dark:text-white
          placeholder-neutral-500
          font-sans outline-none
          ${className}
        `}
        {...props}
      />
      {error && (
        <span className="font-mono text-[10px] text-red-500 uppercase">
          {error}
        </span>
      )}
    </div>
  )
}
