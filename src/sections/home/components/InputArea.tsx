import { useState, useRef, type KeyboardEvent } from 'react'

interface InputAreaProps {
  onSend: (content: string) => void
  onSlashCommand?: (command: string) => void
  currentModel?: string
  isAgentThinking?: boolean
  placeholder?: string
}

const slashCommands = [
  { command: '/status', description: 'Agent 运行状态' },
  { command: '/cron', description: '查看定时任务' },
  { command: '/skills', description: '已安装技能' },
  { command: '/model', description: '切换模型' },
  { command: '/clear', description: '清空对话' },
]

export function InputArea({
  onSend,
  onSlashCommand,
  currentModel = 'OPUS',
  isAgentThinking = false,
  placeholder = 'Message ClawKing Agent...',
}: InputAreaProps) {
  const [value, setValue] = useState('')
  const [showSlash, setShowSlash] = useState(false)
  const [slashFilter, setSlashFilter] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && value.trim()) {
      e.preventDefault()
      if (showSlash) {
        // Select first matching slash command
        const match = filteredCommands[0]
        if (match) {
          onSlashCommand?.(match.command)
          setValue('')
          setShowSlash(false)
        }
      } else {
        onSend(value.trim())
        setValue('')
      }
    }
    if (e.key === 'Escape') {
      setShowSlash(false)
    }
  }

  const handleChange = (val: string) => {
    setValue(val)
    if (val.startsWith('/')) {
      setShowSlash(true)
      setSlashFilter(val.slice(1).toLowerCase())
    } else {
      setShowSlash(false)
    }
  }

  const filteredCommands = slashCommands.filter(
    (cmd) => cmd.command.toLowerCase().includes(slashFilter) || cmd.description.includes(slashFilter)
  )

  return (
    <div className="relative p-4 border-t border-neutral-300 dark:border-neutral-800">
      {/* Slash command palette */}
      {showSlash && filteredCommands.length > 0 && (
        <div className="absolute bottom-full left-4 right-4 mb-1 bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-none overflow-hidden">
          {filteredCommands.map((cmd) => (
            <button
              key={cmd.command}
              onClick={() => {
                onSlashCommand?.(cmd.command)
                setValue('')
                setShowSlash(false)
                inputRef.current?.focus()
              }}
              className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-neutral-200 dark:hover:bg-neutral-900"
            >
              <span className="font-mono text-sm text-black dark:text-white">{cmd.command}</span>
              <span className="text-xs text-neutral-500 font-sans">{cmd.description}</span>
            </button>
          ))}
        </div>
      )}

      {/* Input container */}
      <div className={`flex items-center gap-2 bg-neutral-200 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 px-4 py-3 rounded-none ${
        isAgentThinking ? 'opacity-60' : ''
      }`}>
        {/* Attachment button */}
        <button className="text-neutral-500 hover:text-black dark:hover:text-white shrink-0">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M7 1v14M1 7h14" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>

        {/* Text input */}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isAgentThinking ? 'Agent is thinking...' : placeholder}
          disabled={isAgentThinking}
          className="flex-1 bg-transparent text-sm text-black dark:text-white placeholder-neutral-500 font-sans outline-none disabled:cursor-not-allowed"
        />

        {/* Separator */}
        <span className="w-px h-4 bg-neutral-300 dark:bg-neutral-800" />

        {/* Model indicator */}
        <span className="font-mono text-[10px] text-neutral-500 dark:text-neutral-600 uppercase shrink-0">
          {currentModel}
        </span>
      </div>
    </div>
  )
}
