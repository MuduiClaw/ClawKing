import { useState } from 'react'
import { Button } from '../../../shell/components/ui/Button'
import { TextInput } from '../../../shell/components/ui/TextInput'
import { Badge } from '../../../shell/components/ui/Badge'
import type { Skill } from './SkillCard'

export interface SkillConfig {
  key: string
  label: string
  type: 'string' | 'number' | 'boolean' | 'select'
  value?: unknown
  options?: { label: string; value: string }[]
  required?: boolean
  placeholder?: string
}

export interface SkillDetail {
  skill: Skill
  readme: string
  changelog?: string
  configuration?: SkillConfig[]
}

interface SkillDetailPanelProps {
  detail: SkillDetail
  onClose?: () => void
  onInstall?: (skillId: string) => void
  onUninstall?: (skillId: string) => void
  onUpdate?: (skillId: string) => void
  onSaveConfig?: (skillId: string, config: Record<string, unknown>) => void
}

function ConfigField({
  config,
  value,
  onChange,
}: {
  config: SkillConfig
  value: unknown
  onChange: (key: string, value: unknown) => void
}) {
  switch (config.type) {
    case 'boolean':
      return (
        <div className="flex items-center justify-between">
          <div>
            <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-neutral-500">
              {config.label}
              {config.required && <span className="text-red-500 ml-1">*</span>}
            </div>
          </div>
          <button
            onClick={() => onChange(config.key, !value)}
            className={`w-10 h-5 border rounded-none relative ${
              value
                ? 'bg-green-600 border-green-600'
                : 'bg-neutral-300 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-700'
            }`}
          >
            <span
              className={`absolute top-0.5 w-4 h-3.5 bg-white rounded-none ${
                value ? 'right-0.5' : 'left-0.5'
              }`}
            />
          </button>
        </div>
      )

    case 'select':
      return (
        <div>
          <label className="font-mono text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-2 block">
            {config.label}
            {config.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <select
            value={String(value ?? '')}
            onChange={(e) => onChange(config.key, e.target.value)}
            className="w-full h-9 px-3 bg-neutral-200 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 text-sm text-black dark:text-white font-sans outline-none rounded-none appearance-none"
          >
            <option value="">— Select —</option>
            {config.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      )

    case 'number':
      return (
        <TextInput
          label={`${config.label}${config.required ? ' *' : ''}`}
          type="number"
          defaultValue={String(value ?? '')}
          placeholder={config.placeholder}
          onChange={(e) => onChange(config.key, Number(e.target.value))}
        />
      )

    default: // string
      return (
        <TextInput
          label={`${config.label}${config.required ? ' *' : ''}`}
          type={config.key.toLowerCase().includes('key') || config.key.toLowerCase().includes('secret') ? 'password' : 'text'}
          defaultValue={String(value ?? '')}
          placeholder={config.placeholder}
          onChange={(e) => onChange(config.key, e.target.value)}
        />
      )
  }
}

export function SkillDetailPanel({
  detail,
  onClose,
  onInstall,
  onUninstall,
  onUpdate,
  onSaveConfig,
}: SkillDetailPanelProps) {
  const { skill, readme, changelog, configuration } = detail
  const [tab, setTab] = useState<'readme' | 'config' | 'changelog'>('readme')
  const [configValues, setConfigValues] = useState<Record<string, unknown>>(
    () => {
      const initial: Record<string, unknown> = {}
      configuration?.forEach((c) => {
        if (c.value !== undefined) initial[c.key] = c.value
      })
      return initial
    }
  )

  const handleConfigChange = (key: string, value: unknown) => {
    setConfigValues((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="flex flex-col h-full bg-neutral-50 dark:bg-neutral-950">
      {/* Header */}
      <div className="flex items-center justify-between h-12 px-4 border-b border-neutral-300 dark:border-neutral-800">
        <div className="flex items-center gap-2 min-w-0">
          {skill.icon && <span className="text-lg">{skill.icon}</span>}
          <span className="font-mono text-xs font-bold uppercase tracking-tight text-black dark:text-white truncate">
            {skill.name}
          </span>
          <Badge variant="default">v{skill.version}</Badge>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 flex items-center justify-center text-neutral-500 hover:text-black dark:hover:text-white rounded-none"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </button>
      </div>

      {/* Skill meta */}
      <div className="px-4 py-3 border-b border-neutral-300 dark:border-neutral-800">
        <p className="text-sm text-neutral-500 font-sans mb-3">{skill.description}</p>
        <div className="flex items-center gap-3 mb-3">
          {skill.rating !== undefined && (
            <span className="font-mono text-[10px] text-neutral-400">★ {skill.rating.toFixed(1)}</span>
          )}
          {skill.installCount !== undefined && (
            <span className="font-mono text-[10px] text-neutral-400">
              {skill.installCount >= 1000 ? `${(skill.installCount / 1000).toFixed(1)}k` : skill.installCount} installs
            </span>
          )}
          {skill.categories.map((cat) => (
            <span key={cat} className="px-1.5 py-0.5 font-mono text-[10px] uppercase bg-neutral-200 dark:bg-neutral-800 text-neutral-500 rounded-none">
              {cat}
            </span>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {skill.isInstalled ? (
            <>
              {skill.isUpdateAvailable && (
                <Button variant="primary" size="sm" onClick={() => onUpdate?.(skill.id)}>
                  UPDATE
                </Button>
              )}
              <Button variant="danger" size="sm" onClick={() => onUninstall?.(skill.id)}>
                UNINSTALL
              </Button>
            </>
          ) : (
            <Button variant="primary" size="sm" onClick={() => onInstall?.(skill.id)}>
              INSTALL
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 px-4 py-2 border-b border-neutral-300 dark:border-neutral-800">
        {(['readme', ...(configuration && configuration.length > 0 ? ['config'] : []), ...(changelog ? ['changelog'] : [])] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t as typeof tab)}
            className={`font-mono text-[11px] font-bold uppercase tracking-wider pb-1 border-b-2 ${
              tab === t
                ? 'text-black dark:text-white border-black dark:border-white'
                : 'text-neutral-500 border-transparent hover:text-neutral-700 dark:hover:text-neutral-300'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {tab === 'readme' && (
          <div className="text-sm text-neutral-700 dark:text-neutral-300 font-sans leading-relaxed">
            {readme.split('\n').map((line, i) => {
              if (line.startsWith('# ')) return <h1 key={i} className="font-mono text-lg font-bold uppercase mt-6 mb-3 text-black dark:text-white">{line.slice(2)}</h1>
              if (line.startsWith('## ')) return <h2 key={i} className="font-mono text-sm font-bold uppercase mt-4 mb-2 text-black dark:text-white">{line.slice(3)}</h2>
              if (line.startsWith('- ')) return <li key={i} className="ml-4 list-disc">{line.slice(2)}</li>
              if (line.trim() === '') return <div key={i} className="h-2" />
              return <p key={i} className="my-1">{line}</p>
            })}
          </div>
        )}

        {tab === 'config' && configuration && (
          <div className="space-y-5">
            <h3 className="font-mono text-sm font-bold uppercase tracking-tight text-black dark:text-white">
              CONFIGURATION
            </h3>
            <p className="text-xs text-neutral-500 font-sans">
              配置此 Skill 所需的 API 密钥和选项
            </p>

            <div className="space-y-4">
              {configuration.map((config) => (
                <ConfigField
                  key={config.key}
                  config={config}
                  value={configValues[config.key]}
                  onChange={handleConfigChange}
                />
              ))}
            </div>

            <Button
              variant="primary"
              size="md"
              onClick={() => onSaveConfig?.(skill.id, configValues)}
            >
              SAVE CONFIG
            </Button>
          </div>
        )}

        {tab === 'changelog' && changelog && (
          <div className="text-sm text-neutral-700 dark:text-neutral-300 font-sans leading-relaxed">
            {changelog.split('\n').map((line, i) => {
              if (line.startsWith('## ')) return <h2 key={i} className="font-mono text-sm font-bold uppercase mt-4 mb-2 text-black dark:text-white">{line.slice(3)}</h2>
              if (line.startsWith('- ')) return <li key={i} className="ml-4 list-disc">{line.slice(2)}</li>
              if (line.trim() === '') return <div key={i} className="h-2" />
              return <p key={i} className="my-1">{line}</p>
            })}
          </div>
        )}
      </div>
    </div>
  )
}
