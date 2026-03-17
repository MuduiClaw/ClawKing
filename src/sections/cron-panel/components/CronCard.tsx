import { Badge } from '../../../shell/components/ui/Badge'

export interface CronJob {
  id: string
  name: string
  description?: string
  schedule: string
  status: 'active' | 'paused' | 'failed' | 'running'
  lastRunAt?: number
  lastRunStatus?: 'ok' | 'error' | 'timeout'
  lastRunError?: string
  nextRunAt?: number
  consecutiveErrors: number
  totalRuns: number
  successRate: number
}

interface CronCardProps {
  job: CronJob
  onToggle?: (jobId: string, enabled: boolean) => void
  onRetry?: (jobId: string) => void
  onEdit?: (jobId: string) => void
  onViewHistory?: (jobId: string) => void
}

function formatRelativeTime(ts: number): string {
  const diff = Date.now() - ts
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return '刚刚'
  if (mins < 60) return `${mins}min前`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h前`
  return `${Math.floor(hours / 24)}d前`
}

function formatNextRun(ts: number): string {
  const d = new Date(ts)
  const now = new Date()
  const isToday = d.toDateString() === now.toDateString()
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const isTomorrow = d.toDateString() === tomorrow.toDateString()
  const time = `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
  if (isToday) return `今天 ${time}`
  if (isTomorrow) return `明天 ${time}`
  return `${d.getMonth() + 1}/${d.getDate()} ${time}`
}

const statusConfig = {
  ok: { icon: '✅', badge: 'success' as const },
  error: { icon: '❌', badge: 'danger' as const },
  timeout: { icon: '⏱', badge: 'warning' as const },
}

export function CronCard({ job, onToggle, onRetry, onEdit, onViewHistory }: CronCardProps) {
  const isActive = job.status === 'active' || job.status === 'running'
  const isPaused = job.status === 'paused'
  const isFailed = job.status === 'failed'

  return (
    <div
      className={`border rounded-none p-4 ${
        isFailed
          ? 'border-red-500 dark:border-red-500 bg-red-50 dark:bg-red-950/20'
          : isPaused
          ? 'border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-950 opacity-60'
          : 'border-neutral-300 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950'
      }`}
    >
      {/* Header: name + toggle */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm">⏰</span>
          <span className="font-sans text-sm font-semibold text-black dark:text-white">
            {job.name}
          </span>
          {job.status === 'running' && (
            <span className="w-2 h-2 bg-orange-500 animate-pulse rounded-none" />
          )}
          {isPaused && <Badge variant="default">PAUSED</Badge>}
          {job.consecutiveErrors > 0 && job.consecutiveErrors < 3 && (
            <Badge variant="warning">{job.consecutiveErrors} ERR</Badge>
          )}
        </div>

        {/* Toggle */}
        <button
          onClick={() => onToggle?.(job.id, !isActive)}
          className={`w-10 h-5 border rounded-none relative ${
            isActive
              ? 'bg-green-600 border-green-600'
              : 'bg-neutral-300 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-700'
          }`}
        >
          <span
            className={`absolute top-0.5 w-4 h-3.5 bg-white rounded-none transition-none ${
              isActive ? 'right-0.5' : 'left-0.5'
            }`}
          />
        </button>
      </div>

      {/* Meta info */}
      <div className="flex items-center gap-2 text-xs font-mono text-neutral-500 mb-2">
        <span>{job.schedule}</span>
        {job.lastRunAt && (
          <>
            <span>·</span>
            <span>最近运行 {formatRelativeTime(job.lastRunAt)}</span>
            {job.lastRunStatus && (
              <span>{statusConfig[job.lastRunStatus].icon}</span>
            )}
          </>
        )}
      </div>

      {job.nextRunAt && isActive && (
        <div className="text-xs font-mono text-neutral-400 mb-2">
          下次运行: {formatNextRun(job.nextRunAt)}
        </div>
      )}

      {/* Error message */}
      {job.lastRunError && (
        <div className="text-xs font-mono text-red-500 mb-2 p-2 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-none">
          {job.lastRunError}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 mt-3">
        {isFailed && (
          <button
            onClick={() => onRetry?.(job.id)}
            className="px-2 py-1 text-[10px] font-mono uppercase border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-black rounded-none"
          >
            RETRY
          </button>
        )}
        <button
          onClick={() => onViewHistory?.(job.id)}
          className="px-2 py-1 text-[10px] font-mono uppercase text-neutral-500 hover:text-black dark:hover:text-white border border-neutral-300 dark:border-neutral-800 hover:border-neutral-500 rounded-none"
        >
          HISTORY
        </button>
        <button
          onClick={() => onEdit?.(job.id)}
          className="px-2 py-1 text-[10px] font-mono uppercase text-neutral-500 hover:text-black dark:hover:text-white border border-neutral-300 dark:border-neutral-800 hover:border-neutral-500 rounded-none"
        >
          EDIT
        </button>
      </div>
    </div>
  )
}
