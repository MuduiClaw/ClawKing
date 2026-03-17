import { useState } from 'react'
import { Button } from '../../../shell/components/ui/Button'
import { TextInput } from '../../../shell/components/ui/TextInput'

interface SettingsProps {
  activeSection?: string
  onSectionChange?: (section: string) => void
  // Compute
  currentModel?: string
  fallbackModel?: string
  provider?: 'cloud' | 'byos'
  // Agent
  agentName?: string
  soulContent?: string
  // Memory
  lcmEnabled?: boolean
  totalMemories?: number
  memoryUsageMB?: number
  // Account
  email?: string
  displayName?: string
  plan?: 'free' | 'pro' | 'enterprise'
  onSave?: (section: string, data: Record<string, unknown>) => void
}

const sections = [
  { id: 'compute', label: 'COMPUTE' },
  { id: 'agent', label: 'AGENT' },
  { id: 'memory', label: 'MEMORY' },
  { id: 'channels', label: 'CHANNELS' },
  { id: 'account', label: 'ACCOUNT' },
] as const

function ComputeSection({
  currentModel = 'Claude Opus',
  fallbackModel = 'Claude Sonnet',
  provider = 'cloud',
}: Pick<SettingsProps, 'currentModel' | 'fallbackModel' | 'provider'>) {
  return (
    <div className="space-y-6">
      <h3 className="font-mono text-sm font-bold uppercase tracking-tight text-black dark:text-white">
        COMPUTE SETTINGS
      </h3>

      {/* Provider toggle */}
      <div>
        <label className="font-mono text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-2 block">
          PROVIDER
        </label>
        <div className="flex border border-neutral-300 dark:border-neutral-800 rounded-none overflow-hidden w-fit">
          <button className={`px-4 py-2 font-mono text-xs font-bold uppercase ${
            provider === 'cloud'
              ? 'bg-black text-white dark:bg-white dark:text-black'
              : 'bg-transparent text-neutral-500'
          }`}>
            CLOUD
          </button>
          <button className={`px-4 py-2 font-mono text-xs font-bold uppercase border-l border-neutral-300 dark:border-neutral-800 ${
            provider === 'byos'
              ? 'bg-black text-white dark:bg-white dark:text-black'
              : 'bg-transparent text-neutral-500'
          }`}>
            BYOS
          </button>
        </div>
      </div>

      {/* Model selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="font-mono text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-2 block">
            PRIMARY MODEL
          </label>
          <div className="h-9 px-3 flex items-center bg-neutral-200 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-none text-sm font-sans text-black dark:text-white">
            {currentModel}
          </div>
        </div>
        <div>
          <label className="font-mono text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-2 block">
            FALLBACK MODEL
          </label>
          <div className="h-9 px-3 flex items-center bg-neutral-200 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-none text-sm font-sans text-black dark:text-white">
            {fallbackModel}
          </div>
        </div>
      </div>

      {/* BYOS key */}
      {provider === 'byos' && (
        <TextInput
          label="API KEY"
          type="password"
          placeholder="sk-..."
        />
      )}
    </div>
  )
}

function AgentSection({
  agentName = 'ClawKing Agent',
  soulContent = '',
}: Pick<SettingsProps, 'agentName' | 'soulContent'>) {
  return (
    <div className="space-y-6">
      <h3 className="font-mono text-sm font-bold uppercase tracking-tight text-black dark:text-white">
        AGENT PERSONALITY
      </h3>

      <TextInput label="AGENT NAME" defaultValue={agentName} />

      {/* SOUL.md Editor */}
      <div>
        <label className="font-mono text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-2 block">
          SOUL.MD
        </label>
        <textarea
          defaultValue={soulContent}
          className="w-full min-h-[200px] p-4 bg-black text-neutral-300 font-mono text-xs leading-relaxed border border-neutral-300 dark:border-neutral-800 rounded-none outline-none resize-y"
          placeholder="# SOUL.md&#10;&#10;Define your agent's personality..."
        />
        <p className="mt-1 font-mono text-[10px] text-neutral-500 uppercase">
          MARKDOWN SUPPORTED · DEFINES AGENT VOICE & BEHAVIOR
        </p>
      </div>
    </div>
  )
}

function MemorySection({
  lcmEnabled = true,
  totalMemories = 0,
  memoryUsageMB = 0,
}: Pick<SettingsProps, 'lcmEnabled' | 'totalMemories' | 'memoryUsageMB'>) {
  return (
    <div className="space-y-6">
      <h3 className="font-mono text-sm font-bold uppercase tracking-tight text-black dark:text-white">
        MEMORY MANAGEMENT
      </h3>

      {/* LCM Toggle */}
      <div className="flex items-center justify-between p-4 border border-neutral-300 dark:border-neutral-800 rounded-none">
        <div>
          <div className="font-sans text-sm font-semibold text-black dark:text-white mb-1">
            Long Context Memory
          </div>
          <div className="font-mono text-[10px] text-neutral-500 uppercase">
            {totalMemories} MEMORIES · {memoryUsageMB.toFixed(1)} MB
          </div>
        </div>
        <button className={`w-10 h-5 border rounded-none relative ${
          lcmEnabled
            ? 'bg-green-600 border-green-600'
            : 'bg-neutral-300 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-700'
        }`}>
          <span className={`absolute top-0.5 w-4 h-3.5 bg-white rounded-none ${
            lcmEnabled ? 'right-0.5' : 'left-0.5'
          }`} />
        </button>
      </div>

      {/* Danger zone */}
      <div className="p-4 border border-red-300 dark:border-red-800 rounded-none">
        <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-red-500 mb-2">
          DANGER ZONE
        </div>
        <p className="text-xs text-neutral-500 font-sans mb-3">
          清空所有记忆数据，此操作不可撤销
        </p>
        <Button variant="danger" size="sm">
          CLEAR ALL MEMORIES
        </Button>
      </div>
    </div>
  )
}

function AccountSection({
  email = '',
  displayName = '',
  plan = 'free',
}: Pick<SettingsProps, 'email' | 'displayName' | 'plan'>) {
  return (
    <div className="space-y-6">
      <h3 className="font-mono text-sm font-bold uppercase tracking-tight text-black dark:text-white">
        ACCOUNT
      </h3>

      <TextInput label="DISPLAY NAME" defaultValue={displayName} />
      <TextInput label="EMAIL" defaultValue={email} disabled />

      {/* Plan info */}
      <div className="p-4 border border-neutral-300 dark:border-neutral-800 rounded-none">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-sans text-sm font-semibold text-black dark:text-white mb-1">
              Current Plan
            </div>
            <span className="font-mono text-xs font-bold uppercase text-orange-500">
              {plan.toUpperCase()}
            </span>
          </div>
          {plan === 'free' && (
            <Button variant="primary" size="sm">
              UPGRADE
            </Button>
          )}
        </div>
      </div>

      {/* Logout */}
      <Button variant="ghost" size="md" className="text-red-500">
        LOGOUT
      </Button>
    </div>
  )
}

export function Settings({
  activeSection = 'compute',
  onSectionChange,
  ...props
}: SettingsProps) {
  const [section, setSection] = useState(activeSection)

  const handleSectionChange = (s: string) => {
    setSection(s)
    onSectionChange?.(s)
  }

  return (
    <div className="flex flex-col md:flex-row h-full">
      {/* Nav — left on desktop, top on mobile */}
      <nav className="md:w-40 border-b md:border-b-0 md:border-r border-neutral-300 dark:border-neutral-800">
        {/* Mobile: horizontal scroll */}
        <div className="flex md:flex-col overflow-x-auto md:overflow-visible py-2 md:py-4">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => handleSectionChange(s.id)}
              className={`px-4 py-2 text-left font-mono text-xs font-bold uppercase tracking-wider shrink-0 border-l-0 md:border-l-2 ${
                section === s.id
                  ? 'text-black dark:text-white md:border-black md:dark:border-white bg-neutral-200 dark:bg-neutral-800'
                  : 'text-neutral-500 border-transparent hover:text-neutral-700 dark:hover:text-neutral-300'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {section === 'compute' && <ComputeSection {...props} />}
        {section === 'agent' && <AgentSection {...props} />}
        {section === 'memory' && <MemorySection {...props} />}
        {section === 'channels' && (
          <div className="space-y-6">
            <h3 className="font-mono text-sm font-bold uppercase tracking-tight text-black dark:text-white">
              CHANNELS
            </h3>
            <p className="text-sm text-neutral-500 font-sans">
              频道管理功能即将上线
            </p>
          </div>
        )}
        {section === 'account' && <AccountSection {...props} />}
      </div>
    </div>
  )
}
