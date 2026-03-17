import { Badge } from '../../../shell/components/ui/Badge'
import { Button } from '../../../shell/components/ui/Button'

export interface Skill {
  id: string
  name: string
  description: string
  version: string
  icon?: string
  rating?: number
  installCount?: number
  isInstalled: boolean
  isUpdateAvailable?: boolean
  categories: string[]
}

interface SkillCardProps {
  skill: Skill
  onInstall?: (skillId: string) => void
  onUninstall?: (skillId: string) => void
  onUpdate?: (skillId: string) => void
  onViewDetail?: (skillId: string) => void
}

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}

export function SkillCard({
  skill,
  onInstall,
  onUninstall,
  onUpdate,
  onViewDetail,
}: SkillCardProps) {
  return (
    <button
      onClick={() => onViewDetail?.(skill.id)}
      className="w-full text-left border border-neutral-300 dark:border-neutral-800 p-4 rounded-none hover:border-neutral-500 dark:hover:border-neutral-500"
    >
      {/* Header: icon + name + version */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          {skill.icon && <span className="text-lg">{skill.icon}</span>}
          <span className="font-mono text-sm font-bold text-black dark:text-white">
            {skill.name}
          </span>
        </div>
        {skill.isUpdateAvailable && (
          <Badge variant="accent">UPDATE</Badge>
        )}
      </div>

      {/* Description */}
      <p className="text-xs text-neutral-500 font-sans mb-3 line-clamp-1">
        {skill.description}
      </p>

      {/* Meta */}
      <div className="flex items-center gap-3 mb-3">
        <span className="font-mono text-[10px] text-neutral-400 uppercase">
          v{skill.version}
        </span>
        {skill.rating !== undefined && (
          <span className="font-mono text-[10px] text-neutral-400">
            ★ {skill.rating.toFixed(1)}
          </span>
        )}
        {skill.installCount !== undefined && (
          <span className="font-mono text-[10px] text-neutral-400">
            {formatCount(skill.installCount)} installs
          </span>
        )}
      </div>

      {/* Action button */}
      <div onClick={(e) => e.stopPropagation()}>
        {skill.isInstalled ? (
          skill.isUpdateAvailable ? (
            <Button variant="primary" size="sm" onClick={() => onUpdate?.(skill.id)}>
              UPDATE
            </Button>
          ) : (
            <Badge variant="success">INSTALLED ✓</Badge>
          )
        ) : (
          <Button variant="primary" size="sm" onClick={() => onInstall?.(skill.id)}>
            INSTALL
          </Button>
        )}
      </div>
    </button>
  )
}
