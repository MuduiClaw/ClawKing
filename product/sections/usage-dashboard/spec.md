# Section: Usage Dashboard — 用量仪表盘

## 功能描述
Token 消耗、成本趋势、按维度分析。帮助用户理解 Agent 的"运营成本"——谁在花钱、花在哪里、趋势如何。对高客单价用户，透明的用量数据是信任的基石。

## 信息架构
```
┌─────────────────────────────────────────┐
│  Dashboard Header                        │
│  USAGE · March 2026                      │
├─────────────────────────────────────────┤
│                                         │
│  ┌── Summary Cards ──────────────────┐  │
│  │ TOKENS     COST       TASKS       │  │
│  │ 2.4M       ¥386       847         │  │
│  │ ↑12%       ↑8%        ↑23%        │  │
│  └──────────────────────────────────┘  │
│                                         │
│  ┌── Cost Trend Chart ───────────────┐  │
│  │  ¥400 ┤                           │  │
│  │       │    ╭──╮                   │  │
│  │  ¥300 ┤ ╭─╯  ╰─╮     ╭──        │  │
│  │       │╭╯       ╰─╮╭─╯           │  │
│  │  ¥200 ┤            ╰╯            │  │
│  │       ├──┬──┬──┬──┬──┬──┬──      │  │
│  │       1  5  10 15 20 25 30       │  │
│  └──────────────────────────────────┘  │
│                                         │
│  ┌── Breakdown ──────────────────────┐  │
│  │ BY MODEL          BY SKILL        │  │
│  │ Opus    68%       himalaya  22%   │  │
│  │ Sonnet  24%       bird      18%   │  │
│  │ Flash    8%       blogwatch 15%   │  │
│  │                   cron      45%   │  │
│  └──────────────────────────────────┘  │
│                                         │
└─────────────────────────────────────────┘
```

## 数据模型

```typescript
interface UsageSummary {
  period: string                     // "2026-03"
  totalTokens: number
  totalCost: number                  // ¥
  totalTasks: number
  tokensTrend: number                // % 环比
  costTrend: number
  tasksTrend: number
}

interface UsageTimeSeries {
  date: string                       // "2026-03-17"
  tokens: number
  cost: number
  tasks: number
}

interface UsageBreakdown {
  dimension: 'model' | 'skill' | 'cron' | 'channel'
  items: {
    name: string
    tokens: number
    cost: number
    percentage: number
  }[]
}

interface UsageDashboardProps {
  summary: UsageSummary
  timeSeries: UsageTimeSeries[]
  breakdowns: UsageBreakdown[]
  selectedPeriod?: string
  onPeriodChange?: (period: string) => void
}
```

## 交互流程

### 查看概览
1. 顶部 Summary Cards 显示本月核心指标
2. 趋势图显示每日成本曲线
3. 下方分维度饼图/条形图

### 切换时间段
- 月份选择器（← March 2026 →）
- 数据刷新

### 钻取
- 点击 Breakdown 条目 → 展开详细列表
- 如点击 "Opus 68%" → 显示 Opus 的每日用量 + 哪些任务使用了 Opus

### 预算预警
- 如果当月用量接近预算（>80%）→ 顶部 Warning Banner
- 超预算 → 红色 Banner + 建议降级模型

## 视觉规格

### Summary Cards
- 容器: border 1px · border-neutral-300 dark:border-neutral-800 · p-4
- 三卡并排（Desktop）/ 三卡堆叠（Mobile）
- 指标名: font-mono 10px 700 UPPERCASE · text-neutral-500
- 指标值: font-mono 24px 700 · text-black dark:text-white
- 趋势: font-mono 12px · text-green-600 (↑) / text-red-500 (↓)

### Chart
- 背景: 透明
- 轴线: border-neutral-300 dark:border-neutral-800
- 曲线: stroke-orange-500 · stroke-width-2
- 填充: fill-orange-500/10
- 标签: font-mono 10px · text-neutral-500
- 网格线: stroke-neutral-200 dark:stroke-neutral-800 · dashed

### Breakdown
- 条形图: 水平条
- 条: bg-orange-500（主色）/ bg-neutral-300 dark:bg-neutral-700（底色）
- 标签: font-sans 13px · 左侧名称 · 右侧百分比
- 间距: 每行 8px

### Warning Banner
- bg-amber-500/10 · border border-amber-500 · text-amber-700 dark:text-amber-400
- font-mono 12px UPPERCASE

## 响应式行为

### Desktop
- 面板/浮层形式
- Summary Cards 水平排列
- Chart + Breakdown 左右分列

### Mobile
- 全屏
- Summary Cards 纵向堆叠
- Chart 全宽
- Breakdown 全宽堆叠

## 空状态
- 首月无数据时：
  - `NO USAGE DATA YET`
  - `Agent 开始工作后，用量数据将在这里显示`
