# Section: Home — 消息流

## 功能描述
用户与 Agent 交互的主界面。消息流是 ClawKing 的核心体验——用户在此发出指令、接收 Agent 产出、查看工具调用过程、审阅长报告入口。

## 信息架构
```
┌─────────────────────────────────────────┐
│  Channel Header                          │
│  # HOME · Agent 在线 · [Canvas] [搜索]   │
├─────────────────────────────────────────┤
│                                         │
│  Message Stream (虚拟化长列表)            │
│                                         │
│  ┌─ Agent Message ──────────────────┐   │
│  │ [CK] ClawKing Agent · 09:00     │   │
│  │ 早上好。已完成今日 Cron 任务：    │   │
│  │ ┌── CronOutput Block ────────┐  │   │
│  │ │ ⏰ CRON — 邮件日报          │  │   │
│  │ │ 收到 23 封邮件，3 封需回复   │  │   │
│  │ └───────────────────────────┘  │   │
│  └──────────────────────────────────┘   │
│                                         │
│  ┌─ User Message ───────────────────┐   │
│  │ [M] mudui · 09:15               │   │
│  │ 帮我看一下竞品最近发了什么       │   │
│  └──────────────────────────────────┘   │
│                                         │
│  ┌─ Agent Message ──────────────────┐   │
│  │ [CK] ClawKing Agent · 09:15     │   │
│  │ ┌── Thinking Block ──────────┐  │   │
│  │ │ 💭 THINKING                │  │   │
│  │ │ 分析用户需求 → blogwatcher  │  │   │
│  │ └───────────────────────────┘  │   │
│  │ ┌── ToolCall Block ──────────┐  │   │
│  │ │ 🔧 TOOL — blogwatcher scan │  │   │
│  │ │ 扫描 3 个 RSS feed...      │  │   │
│  │ └───────────────────────────┘  │   │
│  │ 竞品过去 7 天发布了 7 篇新内容  │   │
│  │ → 在 Canvas 中查看完整报告     │   │
│  └──────────────────────────────────┘   │
│                                         │
├─────────────────────────────────────────┤
│  Input Area                              │
│  ┌──────────────────────────────────┐   │
│  │ [📎] Message Agent... [/] [OPUS] │   │
│  └──────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

## 数据模型

### Message
```typescript
interface Message {
  id: string
  role: 'user' | 'agent' | 'system'
  content: string                    // Markdown 正文
  blocks?: MessageBlock[]            // 内嵌结构化块
  timestamp: number
  status?: 'sending' | 'sent' | 'error'
}

interface MessageBlock {
  type: 'thinking' | 'tool_call' | 'tool_result' | 'cron_output' | 'canvas_link' | 'code' | 'error'
  title?: string                     // 块标题（工具名/Cron 名）
  content: string                    // 块内容
  status?: 'running' | 'done' | 'error'
  isCollapsed?: boolean              // 默认折叠（Thinking/ToolCall 执行完毕后折叠）
  metadata?: Record<string, unknown> // 工具调用参数等
}
```

### ChannelHeader
```typescript
interface ChannelHeaderProps {
  channelName: string
  channelType: 'chat' | 'cron' | 'forum'
  agentStatus: 'online' | 'thinking' | 'offline'
  description?: string
  onToggleCanvas?: () => void
  onSearch?: () => void
}
```

### InputArea
```typescript
interface InputAreaProps {
  onSend: (content: string, attachments?: File[]) => void
  onSlashCommand?: (command: string) => void
  currentModel?: string             // 当前使用的模型标识
  isAgentThinking?: boolean         // Agent 思考中 → 禁用发送
  placeholder?: string
}
```

## Agent 消息类型（6 种渲染）

| 类型 | 视觉标识 | 行为 |
|------|---------|------|
| **Text** | 无特殊样式 | 普通 Markdown 渲染 |
| **Thinking** | `💭 THINKING` · 暗色容器 · mono 字体 | 执行中=展开+脉冲指示器；完毕=折叠，点击展开 |
| **ToolCall** | `🔧 TOOL — {name}` · 绿色标题 · 暗色容器 | 执行中=展开+状态更新；完毕=折叠 |
| **ToolResult** | 紧跟 ToolCall 下方 · 无独立标题 | 内嵌在 ToolCall 块内 |
| **CronOutput** | `⏰ CRON — {name}` · 暗色容器 | 始终展开，带时间戳 |
| **CanvasLink** | `→ 在 Canvas 中查看` · 橙色文字 | 点击打开右侧 Canvas |
| **Error** | `❌ ERROR` · 红色边框 · 暗色容器 | 始终展开，显示错误信息和重试按钮 |

## 交互流程

### 发送消息
1. 用户在输入框键入内容
2. 按 Enter 或点击发送 → 消息出现在流中（status=sending）
3. Agent 开始处理 → Thinking 块出现（展开，脉冲指示器）
4. 工具调用 → ToolCall 块逐个追加（展开）
5. Agent 完成 → Text 回复出现，Thinking/ToolCall 块自动折叠
6. 长内容（>5000 字）→ 文末追加 CanvasLink

### 斜杠指令
- 输入 `/` 触发命令面板（浮层）
- 支持搜索过滤
- 选中后自动填入 + 发送
- 常用指令：`/status` `/cron` `/skills` `/model` `/clear`

### 文件上传
- 点击 📎 或拖拽文件到输入区
- 支持图片预览缩略图
- 文件大小限制 + 类型校验

### 消息操作
- Hover 消息 → 浮动操作栏（复制/重试/删除）
- 长按（移动端）→ 底部操作面板

## 视觉规格

### Channel Header
- 高度: 48px
- 背景: 透明（继承 Content 区背景）
- 底边框: 1px solid border-neutral-300 / dark:border-neutral-800
- 频道名: font-mono 16px 700 UPPERCASE
- Agent 状态: 绿色圆点=在线 / 橙色脉冲=思考中 / 灰色=离线

### Message Bubble
- Agent 头像: 32×32 · bg-orange-500 · font-mono bold · "CK"
- User 头像: 32×32 · bg-neutral-200 dark:bg-neutral-900 · 首字母
- 用户名: font-sans 14px 600
- 时间戳: font-mono 10px UPPERCASE · text-neutral-500 dark:text-neutral-600
- 正文: font-sans 14px 400 · text-neutral-700 dark:text-neutral-300 · leading-relaxed
- 消息间距: 16px

### Block（Thinking/ToolCall/CronOutput）
- 容器: border 1px · border-neutral-300 dark:border-neutral-800 · bg-neutral-100 dark:bg-neutral-900 · p-3
- 标题: font-mono 10px 700 UPPERCASE tracking-wider
- Thinking 标题色: text-neutral-500 dark:text-neutral-600
- ToolCall 标题色: text-green-600 dark:text-green-500
- CronOutput 标题色: text-neutral-500 dark:text-neutral-600
- Error 边框: border-red-500
- 内容: font-mono 12px 400（Thinking/Tool）/ font-sans 14px 400（CronOutput）

### Input Area
- 容器: bg-neutral-200 dark:bg-neutral-900 · border 1px · border-neutral-300 dark:border-neutral-800 · p-4
- 输入框: font-sans 14px · placeholder-neutral-500
- 模型标识: font-mono 10px UPPERCASE · text-neutral-500 dark:text-neutral-600 · 右侧
- 附件按钮: + 图标 · text-neutral-500 · hover:text-black dark:hover:text-white
- 分隔线: w-px h-4 bg-neutral-300 dark:bg-neutral-800（模型标识与附件按钮之间）

## 响应式行为

### Desktop
- Header 始终可见
- 消息流占满 Content 区高度（flex-1 + overflow-y-auto）
- Input 固定在底部

### Mobile
- Header 简化：隐藏 Agent 状态描述，仅显示频道名 + 操作图标
- Input 区高度减小（py-3）
- Block 容器全宽（去掉左侧 margin）
- 消息操作改为长按触发

## 空状态
- 频道无消息时，显示居中引导：
  - Agent 头像（大号 64×64）
  - `CLAWKING AGENT` font-mono UPPERCASE
  - `发送消息开始对话，或使用 / 查看可用指令` font-sans text-neutral-500
  - 3-4 个快速指令按钮（ghost 样式）
