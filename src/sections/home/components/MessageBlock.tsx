import { useState } from 'react'

export interface MessageBlockData {
  type: 'thinking' | 'tool_call' | 'tool_result' | 'cron_output' | 'canvas_link' | 'code' | 'error'
  title?: string
  content: string
  status?: 'running' | 'done' | 'error'
  isCollapsed?: boolean
}

interface MessageBlockProps {
  block: MessageBlockData
  onCanvasOpen?: () => void
}

const blockConfig = {
  thinking: {
    icon: '💭',
    prefix: 'THINKING',
    titleColor: 'text-neutral-500 dark:text-neutral-600',
    borderColor: '',
  },
  tool_call: {
    icon: '🔧',
    prefix: 'TOOL',
    titleColor: 'text-green-600 dark:text-green-500',
    borderColor: '',
  },
  tool_result: {
    icon: '↩',
    prefix: 'RESULT',
    titleColor: 'text-neutral-500 dark:text-neutral-600',
    borderColor: '',
  },
  cron_output: {
    icon: '⏰',
    prefix: 'CRON',
    titleColor: 'text-neutral-500 dark:text-neutral-600',
    borderColor: '',
  },
  canvas_link: {
    icon: '→',
    prefix: '',
    titleColor: 'text-orange-500',
    borderColor: '',
  },
  code: {
    icon: '',
    prefix: '',
    titleColor: '',
    borderColor: '',
  },
  error: {
    icon: '❌',
    prefix: 'ERROR',
    titleColor: 'text-red-500',
    borderColor: 'border-red-500 dark:border-red-500',
  },
}

export function MessageBlock({ block, onCanvasOpen }: MessageBlockProps) {
  const [collapsed, setCollapsed] = useState(block.isCollapsed ?? false)
  const config = blockConfig[block.type]

  // Canvas link is a special inline element
  if (block.type === 'canvas_link') {
    return (
      <button
        onClick={onCanvasOpen}
        className="text-sm text-orange-500 hover:underline font-sans"
      >
        → {block.content || '在 Canvas 中查看完整报告'}
      </button>
    )
  }

  // Code block
  if (block.type === 'code') {
    return (
      <div className="border border-neutral-300 dark:border-neutral-800 bg-black rounded-none overflow-x-auto">
        <pre className="p-4 text-xs font-mono text-neutral-300 leading-relaxed">
          <code>{block.content}</code>
        </pre>
      </div>
    )
  }

  // Structured blocks (Thinking, ToolCall, CronOutput, Error)
  const isRunning = block.status === 'running'

  return (
    <div
      className={`border rounded-none bg-neutral-100 dark:bg-neutral-900 ${
        config.borderColor || 'border-neutral-300 dark:border-neutral-800'
      }`}
    >
      {/* Header — clickable to toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center justify-between px-3 py-2 text-left"
      >
        <div className="flex items-center gap-1.5">
          {config.icon && <span className="text-xs">{config.icon}</span>}
          <span className={`font-mono text-[10px] font-bold uppercase tracking-wider ${config.titleColor}`}>
            {config.prefix}
            {block.title ? ` — ${block.title}` : ''}
          </span>
          {isRunning && (
            <span className="w-1.5 h-1.5 bg-orange-500 animate-pulse rounded-none ml-1" />
          )}
        </div>
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          className={`text-neutral-500 transition-none ${collapsed ? '-rotate-90' : ''}`}
        >
          <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1" />
        </svg>
      </button>

      {/* Content */}
      {!collapsed && (
        <div className="px-3 pb-3 border-t border-neutral-200 dark:border-neutral-800">
          <div className={`mt-2 text-xs leading-relaxed ${
            block.type === 'cron_output'
              ? 'font-sans text-sm text-neutral-700 dark:text-neutral-300'
              : 'font-mono text-neutral-500 dark:text-neutral-500'
          }`}>
            {block.content}
          </div>

          {/* Error retry button */}
          {block.type === 'error' && (
            <button className="mt-2 px-2 py-1 text-xs font-mono uppercase border border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-none">
              RETRY
            </button>
          )}
        </div>
      )}
    </div>
  )
}
