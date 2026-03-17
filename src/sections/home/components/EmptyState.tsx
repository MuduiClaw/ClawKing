interface EmptyStateProps {
  agentName?: string
  quickCommands?: { label: string; command: string }[]
  onQuickCommand?: (command: string) => void
}

const defaultCommands = [
  { label: '📧 查看邮件', command: '帮我看看今天的邮件' },
  { label: '📊 今日简报', command: '给我一份今日简报' },
  { label: '🔍 竞品动态', command: '最近竞品有什么新动作' },
  { label: '⏰ Cron 状态', command: '/status' },
]

export function EmptyState({
  agentName = 'ClawKing Agent',
  quickCommands = defaultCommands,
  onQuickCommand,
}: EmptyStateProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      {/* Agent avatar — large */}
      <div className="w-16 h-16 bg-orange-500 flex items-center justify-center font-mono text-xl font-bold text-black rounded-none mb-4">
        CK
      </div>

      {/* Agent name */}
      <h2 className="font-mono text-sm font-bold uppercase tracking-tight text-black dark:text-white mb-2">
        {agentName}
      </h2>

      {/* Description */}
      <p className="text-sm text-neutral-500 font-sans mb-6 text-center max-w-sm">
        发送消息开始对话，或使用 <span className="font-mono text-neutral-400">/</span> 查看可用指令
      </p>

      {/* Quick commands */}
      <div className="flex flex-wrap gap-2 justify-center max-w-md">
        {quickCommands.map((cmd) => (
          <button
            key={cmd.command}
            onClick={() => onQuickCommand?.(cmd.command)}
            className="px-3 py-2 text-xs font-sans border border-neutral-300 dark:border-neutral-800 text-neutral-500 hover:text-black dark:hover:text-white hover:border-neutral-500 rounded-none"
          >
            {cmd.label}
          </button>
        ))}
      </div>
    </div>
  )
}
