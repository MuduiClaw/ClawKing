import { MessageBubble, type Message } from './MessageBubble'
import { EmptyState } from './EmptyState'

interface MessageStreamProps {
  messages: Message[]
  agentName?: string
  userName?: string
  onCanvasOpen?: () => void
  onQuickCommand?: (command: string) => void
}

export function MessageStream({
  messages,
  agentName,
  userName,
  onCanvasOpen,
  onQuickCommand,
}: MessageStreamProps) {
  if (messages.length === 0) {
    return <EmptyState agentName={agentName} onQuickCommand={onQuickCommand} />
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((msg) => (
        <MessageBubble
          key={msg.id}
          message={msg}
          agentName={agentName}
          userName={userName}
          onCanvasOpen={onCanvasOpen}
        />
      ))}
    </div>
  )
}
