import { Button } from '../../../shell/components/ui/Button'

export interface ServerTemplate {
  id: string
  name: string
  icon: string
  description: string
  preInstalledSkills: string[]
  preCronJobs: string[]
}

interface OnboardingProps {
  step: 'welcome' | 'template' | 'activate'
  templates: ServerTemplate[]
  selectedTemplate?: string
  onRegister?: (method: 'phone' | 'wechat' | 'email') => void
  onSelectTemplate?: (templateId: string) => void
  onSkipTemplate?: () => void
  onActivate?: () => void
  onTryDemo?: () => void
}

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {[1, 2, 3].map((step) => (
        <span
          key={step}
          className={`w-6 h-1.5 rounded-none ${
            step < current
              ? 'bg-black dark:bg-white'
              : step === current
              ? 'bg-orange-500'
              : 'border border-neutral-300 dark:border-neutral-800 bg-transparent'
          }`}
        />
      ))}
    </div>
  )
}

function WelcomeStep({
  onRegister,
  onTryDemo,
}: {
  onRegister?: (method: 'phone' | 'wechat' | 'email') => void
  onTryDemo?: () => void
}) {
  return (
    <div className="flex flex-col items-center">
      <StepIndicator current={1} />

      {/* Logo */}
      <div className="w-16 h-16 bg-orange-500 flex items-center justify-center font-mono text-xl font-bold text-black rounded-none mb-6">
        🦞
      </div>

      <h1 className="font-mono text-2xl font-bold uppercase tracking-tight text-black dark:text-white mb-2">
        CLAWKING
      </h1>
      <p className="text-base text-neutral-500 font-sans mb-8">
        你的数字员工即将上线
      </p>

      {/* Register buttons */}
      <div className="w-full max-w-xs space-y-3">
        <Button variant="primary" size="lg" className="w-full" onClick={() => onRegister?.('phone')}>
          手机号注册
        </Button>
        <Button variant="secondary" size="lg" className="w-full" onClick={() => onRegister?.('wechat')}>
          微信登录
        </Button>
        <Button variant="secondary" size="lg" className="w-full" onClick={() => onRegister?.('email')}>
          邮箱注册
        </Button>
      </div>

      {/* Demo link */}
      <button
        onClick={onTryDemo}
        className="mt-6 font-mono text-xs uppercase tracking-wide text-orange-500 hover:underline"
      >
        体验 DEMO →
      </button>
    </div>
  )
}

function TemplateStep({
  templates,
  selectedTemplate,
  onSelectTemplate,
  onSkipTemplate,
}: {
  templates: ServerTemplate[]
  selectedTemplate?: string
  onSelectTemplate?: (id: string) => void
  onSkipTemplate?: () => void
}) {
  return (
    <div className="flex flex-col items-center">
      <StepIndicator current={2} />

      <h2 className="font-mono text-lg font-bold uppercase tracking-tight text-black dark:text-white mb-2">
        CHOOSE A ROLE
      </h2>
      <p className="text-sm text-neutral-500 font-sans mb-6">
        选一个角色模板，快速配置你的数字员工
      </p>

      {/* Template cards */}
      <div className="w-full max-w-md space-y-3">
        {templates.map((tpl) => (
          <button
            key={tpl.id}
            onClick={() => onSelectTemplate?.(tpl.id)}
            className={`w-full text-left p-6 border rounded-none ${
              selectedTemplate === tpl.id
                ? 'border-orange-500 bg-orange-500/5'
                : 'border-neutral-300 dark:border-neutral-800 hover:border-orange-500'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{tpl.icon}</span>
              <span className="font-mono text-base font-bold uppercase text-black dark:text-white">
                {tpl.name}
              </span>
            </div>
            <p className="text-sm text-neutral-500 font-sans mb-3">
              {tpl.description}
            </p>
            <div className="flex flex-wrap gap-1">
              {tpl.preInstalledSkills.slice(0, 4).map((skill) => (
                <span
                  key={skill}
                  className="px-1.5 py-0.5 font-mono text-[10px] uppercase bg-neutral-200 dark:bg-neutral-800 text-neutral-500 rounded-none"
                >
                  {skill}
                </span>
              ))}
              {tpl.preInstalledSkills.length > 4 && (
                <span className="font-mono text-[10px] text-neutral-400">
                  +{tpl.preInstalledSkills.length - 4}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={onSkipTemplate}
        className="mt-4 font-mono text-xs uppercase tracking-wide text-neutral-500 hover:text-black dark:hover:text-white"
      >
        跳过，从零开始
      </button>
    </div>
  )
}

function ActivateStep({ onActivate }: { onActivate?: () => void }) {
  return (
    <div className="flex flex-col items-center">
      <StepIndicator current={3} />

      <div className="w-16 h-16 bg-orange-500 flex items-center justify-center font-mono text-xl font-bold text-black rounded-none mb-6">
        CK
      </div>

      <h2 className="font-mono text-lg font-bold uppercase tracking-tight text-black dark:text-white mb-2">
        AGENT READY
      </h2>
      <p className="text-sm text-neutral-500 font-sans mb-6 text-center max-w-sm">
        你的 ClawKing Agent 已经上线，点击下方开始第一次对话
      </p>

      <Button variant="primary" size="lg" onClick={onActivate}>
        开始对话
      </Button>
    </div>
  )
}

export function Onboarding({
  step,
  templates,
  selectedTemplate,
  onRegister,
  onSelectTemplate,
  onSkipTemplate,
  onActivate,
  onTryDemo,
}: OnboardingProps) {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {step === 'welcome' && (
          <WelcomeStep onRegister={onRegister} onTryDemo={onTryDemo} />
        )}
        {step === 'template' && (
          <TemplateStep
            templates={templates}
            selectedTemplate={selectedTemplate}
            onSelectTemplate={onSelectTemplate}
            onSkipTemplate={onSkipTemplate}
          />
        )}
        {step === 'activate' && (
          <ActivateStep onActivate={onActivate} />
        )}
      </div>
    </div>
  )
}
