import { MainNav } from './MainNav'
import { UserMenu } from './UserMenu'
import { MobileTabBar } from './MobileTabBar'

export interface Server {
  id: string
  name: string
  initial: string
  isActive?: boolean
}

export interface Category {
  id: string
  label: string
  isExpanded?: boolean
  channels: Channel[]
}

export interface Channel {
  id: string
  name: string
  type: 'chat' | 'cron' | 'forum'
  isActive?: boolean
  unreadCount?: number
}

export interface UserInfo {
  name: string
  avatarUrl?: string
}

export interface AppShellProps {
  children: React.ReactNode
  servers: Server[]
  categories: Category[]
  user?: UserInfo
  activeTab?: 'chat' | 'agent' | 'cron' | 'skills' | 'settings'
  canvas?: React.ReactNode
  isCanvasOpen?: boolean
  isSidebarOpen?: boolean
  onServerSelect?: (serverId: string) => void
  onChannelSelect?: (channelId: string) => void
  onCategoryToggle?: (categoryId: string) => void
  onNavigate?: (tab: string) => void
  onLogout?: () => void
  onNewChannel?: () => void
  onToggleSidebar?: () => void
  onToggleCanvas?: () => void
}

export function AppShell({
  children,
  servers,
  categories,
  user,
  activeTab = 'chat',
  canvas,
  isCanvasOpen = false,
  isSidebarOpen = false,
  onServerSelect,
  onChannelSelect,
  onCategoryToggle,
  onNavigate,
  onLogout,
  onNewChannel,
  onToggleSidebar,
  onToggleCanvas,
}: AppShellProps) {
  return (
    <div className="flex h-screen w-screen bg-neutral-50 text-black dark:bg-black dark:text-white font-sans">
      {/* Mobile hamburger overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={onToggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed z-50 top-0 left-0 h-full w-[260px]
          bg-neutral-100 dark:bg-neutral-950 border-r border-neutral-300 dark:border-neutral-800
          flex flex-col
          md:relative md:z-auto
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {servers.length > 0 ? (
          <MainNav
            servers={servers}
            categories={categories}
            onServerSelect={onServerSelect}
            onChannelSelect={onChannelSelect}
            onCategoryToggle={onCategoryToggle}
            onNewChannel={onNewChannel}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center p-6">
            <p className="text-sm text-neutral-500 dark:text-neutral-500 font-mono uppercase tracking-wide text-center">
              NO SERVERS
            </p>
          </div>
        )}

        <UserMenu
          user={user}
          onLogout={onLogout}
          onNavigate={onNavigate}
        />
      </aside>

      {/* Content area */}
      <main className="flex-1 flex flex-col min-w-0 pb-14 md:pb-0">
        {/* Mobile header */}
        <div className="flex items-center h-12 px-4 border-b border-neutral-300 dark:border-neutral-800 md:hidden">
          <button
            onClick={onToggleSidebar}
            className="mr-3 text-black dark:text-white"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
          <span className="font-mono text-xs font-bold uppercase tracking-tight">
            CLAWKING
          </span>
        </div>

        {/* Content + Canvas split */}
        <div className="flex flex-1 min-h-0">
          <div className="flex-1 min-w-0 flex flex-col">
            {children}
          </div>

          {/* Canvas panel */}
          {isCanvasOpen && canvas && (
            <div className="hidden md:flex w-[400px] border-l border-neutral-300 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-950 flex-col">
              <div className="flex items-center justify-between h-12 px-4 border-b border-neutral-300 dark:border-neutral-800">
                <span className="font-mono text-xs font-bold uppercase tracking-tight">
                  CANVAS
                </span>
                <button
                  onClick={onToggleCanvas}
                  className="text-neutral-500 hover:text-black dark:hover:text-white"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                {canvas}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Mobile Tab Bar */}
      <MobileTabBar
        activeTab={activeTab}
        onNavigate={onNavigate}
      />
    </div>
  )
}
