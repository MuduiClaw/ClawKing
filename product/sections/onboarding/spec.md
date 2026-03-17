# Section: Onboarding — 引导流程

## 功能描述
新用户的第一次体验——从注册到 Agent 开始工作，不超过 5 分钟。核心理念：**不填表，而是对话**。用户选一个模板，Agent 在 Demo Server 里主动对话引导配置。

## 信息架构（3 步流程）
```
Step 1: WELCOME          Step 2: TEMPLATE          Step 3: ACTIVATE
┌─────────────────┐      ┌─────────────────┐       ┌─────────────────┐
│                 │      │                 │       │                 │
│  🦞 CLAWKING    │      │  选一个角色模板  │       │  Agent 在线了！  │
│                 │      │                 │       │                 │
│  你的数字员工    │      │ ┌─────────────┐ │       │  "你好！我是你的 │
│  即将上线       │      │ │ 📋 内容运营  │ │       │   ClawKing Agent│
│                 │      │ │ 管理社媒/邮件│ │       │   让我们开始..." │
│  [手机注册]     │      │ └─────────────┘ │       │                 │
│  [微信登录]     │      │ ┌─────────────┐ │       │  [开始对话]      │
│  [邮箱注册]     │      │ │ 🛒 电商运营  │ │       │                 │
│                 │      │ │ 库存/客服/数据│ │       │                 │
│  [体验 Demo →]  │      │ └─────────────┘ │       │                 │
│                 │      │ ┌─────────────┐ │       │                 │
│                 │      │ │ 🔧 通用助手  │ │       │                 │
│                 │      │ │ 从零开始配置 │ │       │                 │
│                 │      │ └─────────────┘ │       │                 │
│                 │      │                 │       │                 │
│                 │      │  [跳过，从零开始]│       │                 │
└─────────────────┘      └─────────────────┘       └─────────────────┘
```

## 数据模型

```typescript
interface OnboardingState {
  step: 'welcome' | 'template' | 'activate'
  selectedTemplate?: string
  demoServerReady?: boolean
}

interface ServerTemplate {
  id: string
  name: string
  icon: string                      // Emoji
  description: string
  preInstalledSkills: string[]      // Skill IDs
  preCronJobs: string[]             // Cron 预设描述
  preChannels: string[]             // 预设频道名
  sampleData?: boolean              // 是否有 Demo 数据
}

interface OnboardingProps {
  state: OnboardingState
  templates: ServerTemplate[]
  onRegister?: (method: 'phone' | 'wechat' | 'email') => void
  onSelectTemplate?: (templateId: string) => void
  onSkipTemplate?: () => void
  onActivate?: () => void
  onTryDemo?: () => void
}
```

## 模板预设

| 模板 | 预装 Skills | 预设 Cron | 预设频道 |
|------|-----------|----------|---------|
| 📋 内容运营 | bird, himalaya, blogwatcher, crawl4ai | 竞品监控(6h), 邮件日报(09:00), 社媒数据(21:00) | #工作助手, #内容创作, #竞品情报 |
| 🛒 电商运营 | himalaya, crawl4ai, gog | 订单汇总(10:00), 库存预警(12h), 客服邮件(2h) | #工作助手, #订单管理, #客服 |
| 🔧 通用助手 | himalaya, weather | — | #Home |
| 📈 量化交易 | bird, crawl4ai | 行情监控(1h), 持仓报告(09:00) | #工作助手, #行情, #交易日志 |

## 交互流程

### Step 1: Welcome
1. 全屏展示品牌 + 价值主张
2. 登录选项：手机号 / 微信 / 邮箱
3. `体验 Demo` → 无需注册，直接进入预填的 Demo Server 体验 Agent 对话

### Step 2: Template
1. 选一个角色模板卡片
2. 卡片 hover 展开详情（预装 Skills 列表 + Cron 预设）
3. 选择后 → 后台自动创建 Server + 安装 Skills + 配置 Cron
4. `跳过` → 创建空 Server

### Step 3: Activate
1. Server 创建完成 → Agent 自动发送第一条欢迎消息
2. Agent 主动对话引导：
   - "需要我连接你的邮箱吗？" → 用户授权
   - "你最关注哪些竞品？" → 用户输入
   - "设置好了！我每天 9 点给你发邮件摘要" → 确认
3. 引导完成 → 自动进入 Home 频道，正常使用

## 视觉规格

### Step 1 — Welcome
- 全屏居中
- 品牌 Logo: 🦞 64×64
- 标题: font-mono 24px 700 UPPERCASE · `CLAWKING`
- 副标题: font-sans 16px · text-neutral-500 · `你的数字员工即将上线`
- 登录按钮: Button variant=primary size=lg · 全宽
- Demo 链接: font-mono 12px UPPERCASE · text-orange-500 · 底部

### Step 2 — Template
- 页面标题: font-mono 16px 700 UPPERCASE · `CHOOSE A ROLE`
- 模板卡片: border 1px · p-6 · hover:border-orange-500
  - 图标: 48×48 emoji
  - 名称: font-mono 16px 700 UPPERCASE
  - 描述: font-sans 14px · text-neutral-500
  - 标签: Badge 组件 · 列出核心 Skills
- 选中态: border-orange-500 + bg-orange-500/5
- 跳过链接: font-mono 12px · text-neutral-500 · 底部

### Step 3 — Activate
- 过渡到正常的 AppShell 布局
- Agent 欢迎消息使用 Home Section 的消息渲染
- 顶部进度条: 3 步指示器（1-2-3）
- 完成动画: 无（brutalist 风格）——直接切换到正常界面

### 进度指示器
- 3 个方块（step 圆点改为方块，保持 0px 圆角）
- 当前: bg-orange-500
- 已完成: bg-black dark:bg-white
- 未完成: border 1px · bg-transparent

## 响应式行为

### Desktop
- 居中容器 max-w-lg
- 模板卡片纵向堆叠

### Mobile
- 全屏
- 模板卡片全宽
- 底部固定 CTA 按钮

## 空状态
- 不适用（Onboarding 是一次性流程）
