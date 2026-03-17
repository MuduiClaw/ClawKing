import { CronCard, type CronJob } from './CronCard'
import { Button } from '../../../shell/components/ui/Button'

interface CronPanelProps {
  jobs: CronJob[]
  filter?: 'all' | 'active' | 'paused' | 'failed'
  onFilterChange?: (filter: string) => void
  onToggle?: (jobId: string, enabled: boolean) => void
  onRetry?: (jobId: string) => void
  onEdit?: (jobId: string) => void
  onViewHistory?: (jobId: string) => void
  onCreateNew?: () => void
}

const filters = ['all', 'active', 'paused', 'failed'] as const

export function CronPanel({
  jobs,
  filter = 'all',
  onFilterChange,
  onToggle,
  onRetry,
  onEdit,
  onViewHistory,
  onCreateNew,
}: CronPanelProps) {
  const filteredJobs = filter === 'all'
    ? jobs
    : jobs.filter((j) => j.status === filter)

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-300 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-bold uppercase tracking-tight text-black dark:text-white">
            CRON TASKS
          </span>
          <span className="font-mono text-xs text-neutral-500">({jobs.length})</span>
        </div>
        <Button variant="secondary" size="sm" onClick={onCreateNew}>
          + NEW
        </Button>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-4 px-4 py-2 border-b border-neutral-300 dark:border-neutral-800">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => onFilterChange?.(f)}
            className={`font-mono text-[11px] font-bold uppercase tracking-wider pb-1 border-b-2 ${
              filter === f
                ? 'text-black dark:text-white border-black dark:border-white'
                : 'text-neutral-500 border-transparent hover:text-neutral-700 dark:hover:text-neutral-300'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Job list */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredJobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <span className="text-3xl mb-4">⏰</span>
            <h3 className="font-mono text-sm font-bold uppercase tracking-tight text-black dark:text-white mb-2">
              {filter === 'all' ? 'NO CRON TASKS' : `NO ${filter.toUpperCase()} TASKS`}
            </h3>
            <p className="text-sm text-neutral-500 font-sans mb-4 text-center">
              {filter === 'all'
                ? '创建定时任务，让 Agent 自动执行重复工作'
                : '当前筛选条件下没有任务'
              }
            </p>
            {filter === 'all' && (
              <Button variant="primary" size="sm" onClick={onCreateNew}>
                + CREATE FIRST TASK
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredJobs.map((job) => (
              <CronCard
                key={job.id}
                job={job}
                onToggle={onToggle}
                onRetry={onRetry}
                onEdit={onEdit}
                onViewHistory={onViewHistory}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
