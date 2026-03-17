# Section: Settings — 设置中心

## 功能描述
Agent 的"控制台"——算力配置、人格定制、记忆管理、频道管理、账号设置。Settings 是高级用户的深度配置入口，普通用户通过模板已有合理默认值。

## 信息架构
```
┌─────────────────────────────────────────┐
│  Settings Header                         │
│  SETTINGS                                │
├─────────┬───────────────────────────────┤
│ Nav     │ Content                        │
│         │                                │
│ COMPUTE │ ┌── Compute Settings ──────┐  │
│ AGENT   │ │ Model: [Claude Opus ▾]   │  │
│ MEMORY  │ │ Fallback: [Sonnet ▾]     │  │
│ CHANNELS│ │ ───────────────────────  │  │
│ ACCOUNT │ │ Provider: [Cloud ● BYOS] │  │
│         │ │ BYOS Key: [••••••••]     │  │
│         │ │ Monthly Budget: ¥500     │  │
│         │ └──────────────────────────┘  │
│         │                                │
└─────────┴───────────────────────────────┘
```

## 设置分组

### 1. COMPUTE — 算力配置
```typescript
interface ComputeSettings {
  provider: 'cloud' | 'byos'           // Cloud 托管 or 自带 Key
  primaryModel: string                  // 主模型
  fallbackModel?: string                // 降级模型
  byosApiKey?: string                   // BYOS API Key（脱敏显示）
  monthlyBudget?: number                // 月度预算（¥）
  currentUsage?: number                 // 当月已用
}
```
- 模型选择: 下拉列表（Claude Opus / Sonnet / GPT-5 / Gemini Pro）
- Provider 切换: 分段控件 Cloud / BYOS
- BYOS Key: 密码输入框 + 验证按钮
- 预算: 数字输入 + 当前用量进度条

### 2. AGENT — Agent 人格
```typescript
interface AgentSettings {
  name: string                          // Agent 显示名
  soulContent: string                   // SOUL.md 内容
  avatarUrl?: string
  language: 'zh-CN' | 'en'
  timezone: string
}
```
- SOUL.md 编辑器: 代码编辑器组件（Mono 字体 + 语法高亮）
- 预览: 旁边或下方实时预览 Agent 人格描述
- 头像上传: 点击头像 → 文件选择

### 3. MEMORY — 记忆管理
```typescript
interface MemorySettings {
  lcmEnabled: boolean
  totalMemories: number
  memoryUsageMB: number
  maxMemoryMB: number
  recentMemories: MemoryEntry[]
}

interface MemoryEntry {
  id: string
  summary: string
  createdAt: number
  category: string
}
```
- LCM 开关
- 记忆统计: 总条数 / 存储用量
- 记忆列表: 最近 N 条摘要（可搜索、删除）
- 清空记忆: 确认弹窗 + 二次确认输入

### 4. CHANNELS — 频道管理
```typescript
interface ChannelSettings {
  channels: ChannelConfig[]
}

interface ChannelConfig {
  id: string
  name: string
  type: 'chat' | 'cron' | 'forum'
  isDefault: boolean
  linkedCronIds?: string[]
}
```
- 频道列表: 名称 / 类型 / 默认标识
- 新建/编辑/删除
- Cron 输出绑定: 选择哪些 Cron 任务输出到此频道

### 5. ACCOUNT — 账号设置
```typescript
interface AccountSettings {
  email: string
  displayName: string
  plan: 'free' | 'pro' | 'enterprise'
  subscription?: {
    status: 'active' | 'expired' | 'trial'
    expiresAt: number
    autoRenew: boolean
  }
}
```
- 账号信息显示
- 订阅状态 + 续费管理
- 登出按钮

## 视觉规格

### Settings Nav（左侧）
- 宽度: 160px（Desktop），隐藏（Mobile，用 tab 替代）
- 条目: font-mono 12px 700 UPPERCASE · tracking-wider
- 活跃: text-black dark:text-white + bg-neutral-200 dark:bg-neutral-800 + 左侧 2px border-black dark:border-white
- 非活跃: text-neutral-500

### Settings Content（右侧）
- 每组标题: font-mono 14px 700 UPPERCASE · mb-4
- 标签: font-mono 11px 700 UPPERCASE · text-neutral-500
- 输入框: TextInput 组件
- 下拉/选择: 自定义 Select（与 TextInput 样式一致）
- 开关: 自定义 Toggle
- 分组分隔: border-b 1px + py-6

### 代码编辑器（SOUL.md）
- bg-black · font-mono 13px · p-4
- 行号: text-neutral-600 · 左侧
- 最小高度: 200px · 可拖拽调整

## 响应式行为

### Desktop
- 左右分栏（Nav 160px + Content flex-1）
- 面板/浮层形式展示

### Mobile
- 全屏
- Nav 变为顶部水平 tab 滚动
- Content 单列堆叠

## 空状态
- 不适用（Settings 始终有内容）
