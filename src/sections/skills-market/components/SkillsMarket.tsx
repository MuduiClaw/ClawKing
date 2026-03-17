import { SkillCard, type Skill } from './SkillCard'
import { Button } from '../../../shell/components/ui/Button'

interface SkillsMarketProps {
  skills: Skill[]
  installedCount: number
  tab?: 'installed' | 'market' | 'updates'
  searchQuery?: string
  selectedCategory?: string
  categories?: string[]
  onTabChange?: (tab: string) => void
  onSearch?: (query: string) => void
  onInstall?: (skillId: string) => void
  onUninstall?: (skillId: string) => void
  onUpdate?: (skillId: string) => void
  onViewDetail?: (skillId: string) => void
  onCategorySelect?: (category: string | undefined) => void
}

const tabs = [
  { id: 'installed', label: 'INSTALLED' },
  { id: 'market', label: 'MARKET' },
  { id: 'updates', label: 'UPDATES' },
] as const

export function SkillsMarket({
  skills,
  installedCount,
  tab = 'installed',
  searchQuery = '',
  selectedCategory,
  categories = [],
  onTabChange,
  onSearch,
  onInstall,
  onUninstall,
  onUpdate,
  onViewDetail,
  onCategorySelect,
}: SkillsMarketProps) {
  // Filter skills based on tab
  const filteredSkills = skills.filter((s) => {
    if (tab === 'installed') return s.isInstalled
    if (tab === 'updates') return s.isInstalled && s.isUpdateAvailable
    return true // market: show all
  }).filter((s) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      return s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)
    }
    return true
  }).filter((s) => {
    if (selectedCategory) return s.categories.includes(selectedCategory)
    return true
  })

  const updateCount = skills.filter((s) => s.isInstalled && s.isUpdateAvailable).length

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-300 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-bold uppercase tracking-tight text-black dark:text-white">
            SKILLS
          </span>
          <span className="font-mono text-xs text-neutral-500">({installedCount} installed)</span>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 py-2 border-b border-neutral-300 dark:border-neutral-800">
        <div className="flex items-center h-8 px-3 bg-neutral-200 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-none">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-neutral-500 mr-2 shrink-0">
            <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1" />
            <path d="M9.5 9.5L13 13" stroke="currentColor" strokeWidth="1" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearch?.(e.target.value)}
            placeholder="SEARCH SKILLS"
            className="flex-1 bg-transparent text-xs text-black dark:text-white placeholder-neutral-500 font-mono font-medium uppercase tracking-wide outline-none"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 px-4 py-2 border-b border-neutral-300 dark:border-neutral-800">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => onTabChange?.(t.id)}
            className={`font-mono text-[11px] font-bold uppercase tracking-wider pb-1 border-b-2 flex items-center gap-1 ${
              tab === t.id
                ? 'text-black dark:text-white border-black dark:border-white'
                : 'text-neutral-500 border-transparent hover:text-neutral-700 dark:hover:text-neutral-300'
            }`}
          >
            {t.label}
            {t.id === 'updates' && updateCount > 0 && (
              <span className="inline-flex items-center justify-center min-w-[16px] h-4 px-1 bg-orange-500 text-black text-[9px] font-bold rounded-none">
                {updateCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Category tags (market tab only) */}
      {tab === 'market' && categories.length > 0 && (
        <div className="flex items-center gap-2 px-4 py-2 overflow-x-auto border-b border-neutral-300 dark:border-neutral-800">
          <button
            onClick={() => onCategorySelect?.(undefined)}
            className={`px-2 py-1 font-mono text-[10px] uppercase tracking-wide shrink-0 rounded-none ${
              !selectedCategory
                ? 'bg-black text-white dark:bg-white dark:text-black'
                : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-500 hover:text-black dark:hover:text-white'
            }`}
          >
            ALL
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategorySelect?.(cat)}
              className={`px-2 py-1 font-mono text-[10px] uppercase tracking-wide shrink-0 rounded-none ${
                selectedCategory === cat
                  ? 'bg-black text-white dark:bg-white dark:text-black'
                  : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-500 hover:text-black dark:hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Skills grid */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredSkills.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <span className="text-3xl mb-4">🧩</span>
            <h3 className="font-mono text-sm font-bold uppercase tracking-tight text-black dark:text-white mb-2">
              {searchQuery
                ? `NO RESULTS FOR "${searchQuery.toUpperCase()}"`
                : tab === 'installed'
                ? 'NO SKILLS INSTALLED'
                : tab === 'updates'
                ? 'ALL UP TO DATE'
                : 'NO SKILLS FOUND'
              }
            </h3>
            <p className="text-sm text-neutral-500 font-sans mb-4">
              {tab === 'installed' ? '浏览市场安装你的第一个 Skill' : '尝试其他关键词'}
            </p>
            {tab === 'installed' && (
              <Button variant="primary" size="sm" onClick={() => onTabChange?.('market')}>
                BROWSE MARKET
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredSkills.map((skill) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                onInstall={onInstall}
                onUninstall={onUninstall}
                onUpdate={onUpdate}
                onViewDetail={onViewDetail}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
