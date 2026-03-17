import type { Server, Category, Channel } from './AppShell'

interface MainNavProps {
  servers: Server[]
  categories: Category[]
  onServerSelect?: (serverId: string) => void
  onChannelSelect?: (channelId: string) => void
  onCategoryToggle?: (categoryId: string) => void
  onNewChannel?: () => void
}

function ServerSwitcher({
  servers,
  onServerSelect,
}: {
  servers: Server[]
  onServerSelect?: (serverId: string) => void
}) {
  return (
    <div className="flex items-center gap-2 px-3 py-3 border-b border-neutral-300 dark:border-neutral-800">
      {servers.map((server) => (
        <button
          key={server.id}
          onClick={() => onServerSelect?.(server.id)}
          className={`
            w-9 h-9 flex items-center justify-center
            font-mono text-xs font-bold uppercase
            rounded-none border
            ${server.isActive
              ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white'
              : 'bg-transparent text-neutral-500 border-neutral-300 dark:border-neutral-800 hover:border-neutral-500 hover:text-black dark:hover:text-white'
            }
          `}
          title={server.name}
        >
          {server.initial}
        </button>
      ))}
    </div>
  )
}

function SearchBar() {
  return (
    <div className="px-3 py-2 border-b border-neutral-300 dark:border-neutral-800">
      <div className="flex items-center h-8 px-3 bg-neutral-200 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-none">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-neutral-500 mr-2 shrink-0">
          <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1" />
          <path d="M9.5 9.5L13 13" stroke="currentColor" strokeWidth="1" />
        </svg>
        <input
          type="text"
          placeholder="SEARCH"
          className="flex-1 bg-transparent text-xs text-black dark:text-white placeholder-neutral-500 font-mono font-medium uppercase tracking-wide outline-none"
        />
      </div>
    </div>
  )
}

function ChannelItem({
  channel,
  onSelect,
}: {
  channel: Channel
  onSelect?: (id: string) => void
}) {
  const typePrefix = channel.type === 'cron' ? '⏰' : '#'

  return (
    <button
      onClick={() => onSelect?.(channel.id)}
      className={`
        w-full flex items-center justify-between px-3 py-1.5
        text-sm text-left rounded-none
        ${channel.isActive
          ? 'bg-neutral-200 dark:bg-neutral-800 text-black dark:text-white font-semibold'
          : 'text-neutral-500 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-900 hover:text-neutral-700 dark:hover:text-neutral-200'
        }
      `}
    >
      <span className="truncate font-sans">
        <span className="text-neutral-400 dark:text-neutral-600 mr-1.5">{typePrefix}</span>
        {channel.name}
      </span>
      {channel.unreadCount && channel.unreadCount > 0 && (
        <span className="ml-2 min-w-[18px] h-[18px] flex items-center justify-center bg-orange-500 text-white dark:text-black text-[10px] font-mono font-bold rounded-none px-1">
          {channel.unreadCount > 9 ? '9+' : channel.unreadCount}
        </span>
      )}
    </button>
  )
}

function CategoryGroup({
  category,
  onToggle,
  onChannelSelect,
}: {
  category: Category
  onToggle?: (id: string) => void
  onChannelSelect?: (id: string) => void
}) {
  const isExpanded = category.isExpanded !== false

  return (
    <div className="mb-1">
      <button
        onClick={() => onToggle?.(category.id)}
        className="w-full flex items-center px-3 py-1.5 text-left group"
      >
        <svg
          width="8"
          height="8"
          viewBox="0 0 8 8"
          fill="none"
          className={`mr-1.5 text-neutral-400 dark:text-neutral-600 shrink-0 ${isExpanded ? '' : '-rotate-90'}`}
        >
          <path d="M1 2.5L4 5.5L7 2.5" stroke="currentColor" strokeWidth="1" />
        </svg>
        <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-neutral-500 group-hover:text-neutral-700 dark:group-hover:text-neutral-300">
          {category.label}
        </span>
      </button>

      {isExpanded && (
        <div className="ml-2">
          {category.channels.map((channel) => (
            <ChannelItem
              key={channel.id}
              channel={channel}
              onSelect={onChannelSelect}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function MainNav({
  servers,
  categories,
  onServerSelect,
  onChannelSelect,
  onCategoryToggle,
  onNewChannel,
}: MainNavProps) {
  return (
    <div className="flex-1 flex flex-col min-h-0">
      <ServerSwitcher servers={servers} onServerSelect={onServerSelect} />
      <SearchBar />

      <div className="flex-1 overflow-y-auto py-2">
        {categories.map((category) => (
          <CategoryGroup
            key={category.id}
            category={category}
            onToggle={onCategoryToggle}
            onChannelSelect={onChannelSelect}
          />
        ))}
      </div>

      <div className="px-3 py-2 border-t border-neutral-300 dark:border-neutral-800">
        <button
          onClick={onNewChannel}
          className="w-full flex items-center justify-center h-8 border border-neutral-300 dark:border-neutral-800 text-neutral-500 hover:text-black dark:hover:text-white hover:border-neutral-500 font-mono text-xs font-medium uppercase tracking-wide rounded-none"
        >
          + NEW CHANNEL
        </button>
      </div>
    </div>
  )
}
