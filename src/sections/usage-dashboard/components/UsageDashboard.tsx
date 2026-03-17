export interface UsageSummary {
  period: string
  totalTokens: number
  totalCost: number
  totalTasks: number
  tokensTrend: number
  costTrend: number
  tasksTrend: number
}

export interface UsageBreakdownItem {
  name: string
  tokens: number
  cost: number
  percentage: number
}

export interface UsageBreakdown {
  dimension: 'model' | 'skill' | 'cron' | 'channel'
  items: UsageBreakdownItem[]
}

interface UsageDashboardProps {
  summary: UsageSummary
  breakdowns: UsageBreakdown[]
  budgetLimit?: number
  selectedPeriod?: string
  onPeriodChange?: (period: string) => void
}

function formatNumber(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
  return String(n)
}

function TrendBadge({ value }: { value: number }) {
  const isPositive = value > 0
  return (
    <span className={`font-mono text-xs ${isPositive ? 'text-green-600 dark:text-green-500' : 'text-red-500'}`}>
      {isPositive ? '↑' : '↓'}{Math.abs(value)}%
    </span>
  )
}

function SummaryCard({
  label,
  value,
  trend,
  prefix = '',
}: {
  label: string
  value: string
  trend: number
  prefix?: string
}) {
  return (
    <div className="border border-neutral-300 dark:border-neutral-800 p-4 rounded-none">
      <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-2">
        {label}
      </div>
      <div className="font-mono text-2xl font-bold text-black dark:text-white mb-1">
        {prefix}{value}
      </div>
      <TrendBadge value={trend} />
    </div>
  )
}

function BreakdownBar({
  items,
  title,
}: {
  items: UsageBreakdownItem[]
  title: string
}) {
  const maxPct = Math.max(...items.map((i) => i.percentage), 1)

  return (
    <div>
      <h4 className="font-mono text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-3">
        BY {title}
      </h4>
      <div className="space-y-2">
        {items.slice(0, 5).map((item) => (
          <div key={item.name} className="flex items-center gap-3">
            <span className="w-20 text-xs font-sans text-neutral-700 dark:text-neutral-300 truncate">
              {item.name}
            </span>
            <div className="flex-1 h-3 bg-neutral-200 dark:bg-neutral-800 rounded-none overflow-hidden">
              <div
                className="h-full bg-orange-500 rounded-none"
                style={{ width: `${(item.percentage / maxPct) * 100}%` }}
              />
            </div>
            <span className="w-10 text-right font-mono text-[10px] text-neutral-500">
              {item.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function BudgetWarning({ current, limit }: { current: number; limit: number }) {
  const pct = (current / limit) * 100
  if (pct < 80) return null

  const isDanger = pct >= 100

  return (
    <div className={`p-3 border rounded-none mb-4 ${
      isDanger
        ? 'bg-red-50 dark:bg-red-950/20 border-red-500 text-red-700 dark:text-red-400'
        : 'bg-amber-50 dark:bg-amber-950/20 border-amber-500 text-amber-700 dark:text-amber-400'
    }`}>
      <span className="font-mono text-xs font-bold uppercase">
        {isDanger ? '⚠ BUDGET EXCEEDED' : '⚠ APPROACHING BUDGET LIMIT'}
      </span>
      <span className="font-mono text-xs ml-2">
        ¥{current.toFixed(0)} / ¥{limit.toFixed(0)} ({pct.toFixed(0)}%)
      </span>
    </div>
  )
}

export function UsageDashboard({
  summary,
  breakdowns,
  budgetLimit,
  selectedPeriod,
  onPeriodChange,
}: UsageDashboardProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-300 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-bold uppercase tracking-tight text-black dark:text-white">
            USAGE
          </span>
          <span className="font-mono text-xs text-neutral-500">{summary.period}</span>
        </div>
        {/* Period nav */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => {/* prev month */}}
            className="w-6 h-6 flex items-center justify-center text-neutral-500 hover:text-black dark:hover:text-white border border-neutral-300 dark:border-neutral-800 rounded-none"
          >
            ←
          </button>
          <button
            onClick={() => {/* next month */}}
            className="w-6 h-6 flex items-center justify-center text-neutral-500 hover:text-black dark:hover:text-white border border-neutral-300 dark:border-neutral-800 rounded-none"
          >
            →
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Budget warning */}
        {budgetLimit && (
          <BudgetWarning current={summary.totalCost} limit={budgetLimit} />
        )}

        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <SummaryCard
            label="TOKENS"
            value={formatNumber(summary.totalTokens)}
            trend={summary.tokensTrend}
          />
          <SummaryCard
            label="COST"
            value={summary.totalCost.toFixed(0)}
            trend={summary.costTrend}
            prefix="¥"
          />
          <SummaryCard
            label="TASKS"
            value={formatNumber(summary.totalTasks)}
            trend={summary.tasksTrend}
          />
        </div>

        {/* Breakdowns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {breakdowns.map((bd) => (
            <BreakdownBar
              key={bd.dimension}
              items={bd.items}
              title={bd.dimension.toUpperCase()}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
