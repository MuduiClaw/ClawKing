interface MobileTabBarProps {
  activeTab?: 'chat' | 'agent' | 'cron' | 'skills' | 'settings'
  onNavigate?: (tab: string) => void
}

const tabs = [
  {
    id: 'chat',
    label: 'CHAT',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="2" y="3" width="16" height="11" stroke="currentColor" strokeWidth="1.2" />
        <path d="M6 17l4-3h8" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    ),
  },
  {
    id: 'agent',
    label: 'AGENT',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="4" y="2" width="12" height="12" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="8" cy="8" r="1.5" fill="currentColor" />
        <circle cx="12" cy="8" r="1.5" fill="currentColor" />
        <path d="M6 17h8M10 14v3" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    ),
  },
  {
    id: 'cron',
    label: 'CRON',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.2" />
        <path d="M10 5v5l3 3" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    ),
  },
  {
    id: 'skills',
    label: 'SKILLS',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="2" y="2" width="7" height="7" stroke="currentColor" strokeWidth="1.2" />
        <rect x="11" y="2" width="7" height="7" stroke="currentColor" strokeWidth="1.2" />
        <rect x="2" y="11" width="7" height="7" stroke="currentColor" strokeWidth="1.2" />
        <rect x="11" y="11" width="7" height="7" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    ),
  },
  {
    id: 'settings',
    label: 'SETTINGS',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.2" />
        <path d="M10 2v3M10 15v3M2 10h3M15 10h3M4.22 4.22l2.12 2.12M13.66 13.66l2.12 2.12M4.22 15.78l2.12-2.12M13.66 6.34l2.12-2.12" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    ),
  },
] as const

export function MobileTabBar({ activeTab = 'chat', onNavigate }: MobileTabBarProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-stretch h-14 bg-neutral-100 dark:bg-neutral-950 border-t border-neutral-300 dark:border-neutral-800 md:hidden">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onNavigate?.(tab.id)}
            className={`
              flex-1 flex flex-col items-center justify-center gap-0.5
              ${isActive ? 'text-black dark:text-white' : 'text-neutral-400 dark:text-neutral-600'}
            `}
          >
            <span className={isActive ? 'text-orange-500' : ''}>{tab.icon}</span>
            <span className="font-mono text-[9px] font-medium tracking-wider">
              {tab.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
