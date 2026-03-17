interface ChannelHeaderProps {
  channelName: string
  channelType?: 'chat' | 'cron' | 'forum'
  agentStatus?: 'online' | 'thinking' | 'offline'
  description?: string
  onToggleCanvas?: () => void
  onSearch?: () => void
}

const statusIndicator = {
  online: 'bg-green-500',
  thinking: 'bg-orange-500 animate-pulse',
  offline: 'bg-neutral-400 dark:bg-neutral-600',
}

const statusLabel = {
  online: 'ONLINE',
  thinking: 'THINKING...',
  offline: 'OFFLINE',
}

export function ChannelHeader({
  channelName,
  channelType = 'chat',
  agentStatus = 'online',
  description,
  onToggleCanvas,
  onSearch,
}: ChannelHeaderProps) {
  const prefix = channelType === 'cron' ? '⏰' : '#'

  return (
    <div className="hidden md:flex items-center justify-between h-12 px-4 border-b border-neutral-300 dark:border-neutral-800 bg-neutral-50 dark:bg-black">
      {/* Left: channel info */}
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-neutral-400 dark:text-neutral-600">{prefix}</span>
        <span className="font-mono text-sm font-bold uppercase tracking-tight text-black dark:text-white">
          {channelName}
        </span>

        {/* Agent status */}
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-none ${statusIndicator[agentStatus]}`} />
          <span className="font-mono text-[10px] uppercase tracking-wide text-neutral-500">
            {statusLabel[agentStatus]}
          </span>
        </div>

        {description && (
          <>
            <span className="w-px h-4 bg-neutral-300 dark:bg-neutral-800" />
            <span className="text-xs text-neutral-500 truncate font-sans">
              {description}
            </span>
          </>
        )}
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-1">
        <button
          onClick={onSearch}
          className="flex items-center justify-center w-8 h-8 text-neutral-500 hover:text-black dark:hover:text-white rounded-none"
          title="Search"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.2" />
            <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </button>
        <button
          onClick={onToggleCanvas}
          className="px-2 py-1 text-xs font-mono uppercase border border-neutral-300 dark:border-neutral-800 text-neutral-500 hover:text-black dark:hover:text-white hover:border-neutral-500 rounded-none"
        >
          CANVAS
        </button>
      </div>
    </div>
  )
}
