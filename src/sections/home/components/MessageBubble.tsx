import { MessageBlock, type MessageBlockData } from './MessageBlock'

export interface Message {
  id: string
  role: 'user' | 'agent' | 'system'
  content: string
  blocks?: MessageBlockData[]
  timestamp: number
  status?: 'sending' | 'sent' | 'error'
}

interface MessageBubbleProps {
  message: Message
  agentName?: string
  userName?: string
  onCanvasOpen?: () => void
}

function formatTime(ts: number): string {
  const d = new Date(ts)
  const h = d.getHours().toString().padStart(2, '0')
  const m = d.getMinutes().toString().padStart(2, '0')
  return `${h}:${m}`
}

function Avatar({ role, name }: { role: 'user' | 'agent' | 'system'; name: string }) {
  if (role === 'agent') {
    return (
      <div className="w-8 h-8 bg-orange-500 flex items-center justify-center font-mono text-xs font-bold text-black dark:text-black rounded-none shrink-0">
        CK
      </div>
    )
  }

  return (
    <div className="w-8 h-8 bg-neutral-200 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 flex items-center justify-center font-mono text-xs font-bold text-neutral-500 dark:text-neutral-400 rounded-none shrink-0">
      {name.charAt(0).toUpperCase()}
    </div>
  )
}

export function MessageBubble({
  message,
  agentName = 'ClawKing Agent',
  userName = 'User',
  onCanvasOpen,
}: MessageBubbleProps) {
  const displayName = message.role === 'agent' ? agentName : userName
  const isSystem = message.role === 'system'

  // System messages are centered, minimal
  if (isSystem) {
    return (
      <div className="flex justify-center py-2">
        <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-500 bg-neutral-100 dark:bg-neutral-900 px-3 py-1 border border-neutral-300 dark:border-neutral-800 rounded-none">
          {message.content}
        </span>
      </div>
    )
  }

  return (
    <div className="group space-y-2">
      {/* Header: avatar + name + timestamp */}
      <div className="flex items-center gap-2">
        <Avatar role={message.role} name={displayName} />
        <span className="font-sans text-sm font-semibold text-black dark:text-white">
          {displayName}
        </span>
        <span className="font-mono text-[10px] text-neutral-500 dark:text-neutral-600 uppercase">
          {formatTime(message.timestamp)}
        </span>
        {message.status === 'sending' && (
          <span className="font-mono text-[10px] text-neutral-400 uppercase">SENDING...</span>
        )}
        {message.status === 'error' && (
          <span className="font-mono text-[10px] text-red-500 uppercase">FAILED</span>
        )}
      </div>

      {/* Content */}
      <div className="ml-10 space-y-2">
        {/* Blocks (Thinking, ToolCall, etc.) */}
        {message.blocks?.map((block, i) => (
          <MessageBlock key={i} block={block} onCanvasOpen={onCanvasOpen} />
        ))}

        {/* Text content */}
        {message.content && (
          <div className="text-sm text-neutral-700 dark:text-neutral-300 font-sans leading-relaxed">
            {message.content}
          </div>
        )}
      </div>

      {/* Hover actions */}
      <div className="ml-10 hidden group-hover:flex items-center gap-1">
        <button className="px-1.5 py-0.5 text-[10px] font-mono uppercase text-neutral-400 hover:text-black dark:hover:text-white border border-transparent hover:border-neutral-300 dark:hover:border-neutral-800 rounded-none">
          COPY
        </button>
        {message.role === 'user' && (
          <button className="px-1.5 py-0.5 text-[10px] font-mono uppercase text-neutral-400 hover:text-black dark:hover:text-white border border-transparent hover:border-neutral-300 dark:hover:border-neutral-800 rounded-none">
            EDIT
          </button>
        )}
        {message.role === 'agent' && (
          <button className="px-1.5 py-0.5 text-[10px] font-mono uppercase text-neutral-400 hover:text-black dark:hover:text-white border border-transparent hover:border-neutral-300 dark:hover:border-neutral-800 rounded-none">
            RETRY
          </button>
        )}
      </div>
    </div>
  )
}
