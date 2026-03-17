# Section: Cron Panel — 定时任务管理

## 功能描述
Cron 是 ClawKing 的核心差异化能力——Agent 不只是被动回答，更是主动执行。Cron Panel 管理所有定时任务的创建、查看、开关和历史。

## 信息架构
```
┌─────────────────────────────────────────┐
│  Panel Header                            │
│  CRON TASKS (12)  [+ NEW]               │
├─────────────────────────────────────────┤
│  Filter Tabs                             │
│  [ALL] [ACTIVE] [PAUSED] [FAILED]       │
├─────────────────────────────────────────┤
│                                         │
│  ┌── Cron Card ─────────────────────┐   │
│  │  ⏰ 邮件日报             [ON/OFF] │   │
│  │  每天 09:00 · 最近运行 2h前 ✅    │   │
│  │  下次运行: 明天 09:00             │   │
│  │  [查看历史] [编辑]                │   │
│  └──────────────────────────────────┘   │
│                                         │
│  ┌── Cron Card (FAILED) ────────────┐   │
│  │  ⏰ 竞品监控        ❌   [ON/OFF] │   │
│  │  每 6h · 最近运行 30min前 FAILED  │   │
│  │  错误: timeout after 120s         │   │
│  │  [重试] [查看历史] [编辑]          │   │
│  └──────────────────────────────────┘   │
│                                         │
│  ...更多任务卡片                         │
│                                         │
└─────────────────────────────────────────┘
```

## 数据模型

```typescript
interface CronJob {
  id: string
  name: string
  description?: string
  schedule: string               // Cron 表达式 或 人类可读描述
  status: 'active' | 'paused' | 'failed' | 'running'
  lastRunAt?: number
  lastRunStatus?: 'ok' | 'error' | 'timeout'
  lastRunError?: string
  nextRunAt?: number
  consecutiveErrors: number
  totalRuns: number
  successRate: number            // 0-100
  skillId?: string               // 关联的 Skill
  outputChannelId?: string       // 产出发送到哪个频道
}

interface CronPanelProps {
  jobs: CronJob[]
  filter?: 'all' | 'active' | 'paused' | 'failed'
  onToggle?: (jobId: string, enabled: boolean) => void
  onRetry?: (jobId: string) => void
  onEdit?: (jobId: string) => void
  onViewHistory?: (jobId: string) => void
  onCreateNew?: () => void
  onFilterChange?: (filter: string) => void
}

interface CronHistory {
  jobId: string
  runs: CronRun[]
}

interface CronRun {
  id: string
  startedAt: number
  endedAt?: number
  status: 'ok' | 'error' | 'timeout' | 'running'
  output?: string                // 产出摘要
  error?: string
  tokenUsage?: number
}
```

## 交互流程

### 查看任务
1. 从侧边栏底栏点击 Cron 图标 / 移动端 Tab Bar 点击 CRON
2. 面板展示所有 Cron 任务卡片，默认 ALL 筛选
3. 每张卡片显示：名称、频率、最近运行状态、下次时间

### 开关任务
- Toggle 开关直接切换 active/paused
- Paused 态：卡片降低透明度 + 文字"PAUSED"

### 查看历史
- 点击 `查看历史` → 展开历史面板（内嵌或全屏浮层）
- 时间线列表：每次运行的状态、时间、token 消耗
- 失败的运行可展开查看错误详情

### 创建新任务
- 点击 `+ NEW` → Modal 弹出
- 表单：名称 / 描述 / 频率（预设选项 + 自定义 cron 表达式）/ 关联 Skill / 输出频道
- 保存后立即出现在列表

### 重试失败任务
- 点击 `重试` → 立即执行一次
- 卡片状态切换为 running + 脉冲指示器

## 视觉规格

### Panel Header
- 标题: font-mono 14px 700 UPPERCASE
- 任务总数: font-mono · text-neutral-500
- NEW 按钮: Button variant=secondary size=sm

### Filter Tabs
- font-mono 11px 700 UPPERCASE
- 活跃 tab: text-black dark:text-white + border-b-2 border-black dark:border-white
- 非活跃: text-neutral-500

### Cron Card
- 容器: border 1px · border-neutral-300 dark:border-neutral-800 · bg-neutral-50 dark:bg-neutral-950 · p-4
- 名称: font-sans 14px 600
- ⏰ 图标: 前缀
- 频率/时间: font-mono 12px · text-neutral-500
- 状态指示器:
  - ✅ (ok): text-green-600
  - ❌ (error): text-red-500
  - ⏳ (running): text-orange-500 + 脉冲
  - ⏸ (paused): text-neutral-400
- Warning 色: bg-amber-500（consecutiveErrors > 0 但 < 3）
- Toggle: 自定义开关组件 · on=bg-green-600 · off=bg-neutral-300 dark:bg-neutral-700
- 操作按钮: Button variant=ghost size=sm

### 历史时间线
- 每行: 时间戳(mono) + 状态 badge + token 数 + 展开箭头
- 失败行: 左侧 2px border-red-500

## 响应式行为

### Desktop
- 以浮层/面板形式展示（居中或右侧）
- 卡片网格布局（2列）

### Mobile
- Tab Bar 点击全屏展示
- 卡片单列堆叠
- 历史面板全屏覆盖

## 空状态
- 无任务时：
  - 图标: ⏰（大号 48×48）
  - 标题: `NO CRON TASKS` font-mono UPPERCASE
  - 描述: `创建定时任务，让 Agent 自动执行重复工作` font-sans text-neutral-500
  - CTA: Button `+ CREATE FIRST TASK` variant=primary
