interface ModalProps {
  children: React.ReactNode
  isOpen: boolean
  title?: string
  onClose?: () => void
}

export function Modal({ children, isOpen, title, onClose }: ModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative z-10 w-full max-w-lg mx-4 bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-none">
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between h-12 px-4 border-b border-neutral-300 dark:border-neutral-800">
            <span className="font-mono text-xs font-bold uppercase tracking-tight text-black dark:text-white">
              {title}
            </span>
            <button
              onClick={onClose}
              className="text-neutral-500 hover:text-black dark:hover:text-white"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>
          </div>
        )}

        {/* Content */}
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  )
}
