import type { UserInfo } from './AppShell'

interface UserMenuProps {
  user?: UserInfo
  onLogout?: () => void
  onNavigate?: (tab: string) => void
}

function ActionButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center w-8 h-8 text-neutral-500 hover:text-black dark:hover:text-white rounded-none"
      title={label}
    >
      {icon}
    </button>
  )
}

export function UserMenu({ user, onLogout, onNavigate }: UserMenuProps) {
  return (
    <div className="flex items-center justify-between px-3 py-2 border-t border-neutral-300 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-950">
      {/* User info */}
      <div className="flex items-center gap-2 min-w-0">
        {user?.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-8 h-8 rounded-none object-cover border border-neutral-300 dark:border-neutral-800"
          />
        ) : (
          <div className="w-8 h-8 flex items-center justify-center bg-neutral-200 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 font-mono text-xs font-bold uppercase text-neutral-500 dark:text-neutral-400 rounded-none">
            {user?.name?.charAt(0)?.toUpperCase() || '?'}
          </div>
        )}
        <span className="text-[13px] font-medium text-black dark:text-white truncate font-sans">
          {user?.name || 'Guest'}
        </span>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-0.5">
        <ActionButton
          label="Skills"
          onClick={() => onNavigate?.('skills')}
          icon={
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="1" width="6" height="6" stroke="currentColor" strokeWidth="1" />
              <rect x="9" y="1" width="6" height="6" stroke="currentColor" strokeWidth="1" />
              <rect x="1" y="9" width="6" height="6" stroke="currentColor" strokeWidth="1" />
              <rect x="9" y="9" width="6" height="6" stroke="currentColor" strokeWidth="1" />
            </svg>
          }
        />
        <ActionButton
          label="Usage"
          onClick={() => onNavigate?.('usage')}
          icon={
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="8" width="3" height="6" stroke="currentColor" strokeWidth="1" />
              <rect x="6.5" y="5" width="3" height="9" stroke="currentColor" strokeWidth="1" />
              <rect x="11" y="2" width="3" height="12" stroke="currentColor" strokeWidth="1" />
            </svg>
          }
        />
        <ActionButton
          label="Settings"
          onClick={() => onNavigate?.('settings')}
          icon={
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1" />
              <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41" stroke="currentColor" strokeWidth="1" />
            </svg>
          }
        />
      </div>
    </div>
  )
}
