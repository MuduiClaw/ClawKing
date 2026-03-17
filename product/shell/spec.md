# Application Shell Specification

## Overview
ClawKing 桌面端采用三栏布局（对齐 Discord 客户端模型），视觉风格继承 E2B Technical Brutalism——0px 圆角、IBM Plex 字体族、高对比度黑白 + Safety Orange 强调色。Dark mode 优先。

## Design Language
- **Border Radius**: 0px 全局（按钮、输入框、卡片、面板——无例外）
- **Heading Font**: IBM Plex Mono 700, uppercase, tight tracking
- **Body Font**: IBM Plex Sans 400/500
- **Code Font**: IBM Plex Mono 400
- **Accent Color**: #FF8800 (Safety Orange)——仅用于 NEW 标签、未读计数、品牌强调
- **Border Style**: 1px solid，极细线条定义空间，不用阴影
- **Depth**: 完全扁平——无 box-shadow、无渐变、无模糊

## Navigation Structure

### 左侧边栏（固定宽度 260px）
```
┌─────────────────────────┐
│  Server Switcher        │  ← Server 图标列表（垂直排列，类 Discord）
│  ─────────────────────  │
│  [搜索框]               │  ← 频道/消息搜索
│  ─────────────────────  │
│  ▾ 常用                 │  ← Category（可折叠）
│    # Home               │     Channel（带未读 badge）
│    # 工作助手            │
│    # 内容创作            │
│  ─────────────────────  │
│  ▾ 自动任务              │  ← Category
│    # Cron 日报           │     CronOutput 频道（只读标识）
│    # Cron 告警           │
│  ─────────────────────  │
│                         │
│  [+] 新建频道            │  ← 底部操作区
│  ─────────────────────  │
│  ⚙ Settings  📊 Usage  │  ← Discord 风格底栏
│  [Avatar] mudui         │     用户信息 + 设置/用量入口
└─────────────────────────┘
```

### 中间内容区（flex-1）
- 顶部 Header: 频道名 + 频道描述 + 右侧操作（搜索、Canvas 切换、成员）
- 消息流: Agent 消息渲染（6 种类型）+ 虚拟化长列表
- 底部输入区: 文本输入 + 文件上传 + 斜杠指令 + 模型选择器

### 右侧 Canvas（可折叠，默认收起，宽度 400px）
- 点击长报告 / >5000 字内容时展开
- 支持 Markdown 完整渲染、目录导航、PDF 导出
- 收起时完全隐藏，不占空间

## 底栏详情（Discord 风格）
侧边栏底部固定区域，包含：
- 用户头像 + 用户名（左侧）
- ⚙ 设置图标 → 打开 Settings 面板
- 📊 用量图标 → 打开 Usage Dashboard
- 🧩 Skills 图标 → 打开 Skills Market

## Responsive Behavior

### Desktop (>1280px)
- 三栏完整展示（侧边栏 260px + 内容区 flex-1 + Canvas 400px 可折叠）
- 侧边栏始终可见

### Tablet (768px-1280px)
- 两栏（侧边栏 + 内容区）
- Canvas 以覆盖层展示（overlay from right）
- 侧边栏可手动折叠

### Mobile (<768px)
- 单栏内容区
- 侧边栏隐藏，通过 hamburger 图标展开（slide-over）
- 底部 Tab Bar 固定显示：
  ```
  ┌─────┬─────┬─────┬─────┬─────┐
  │ 💬  │ 🤖  │ ⏰  │ 🧩  │ ⚙️  │
  │ 对话 │ Agent│ Cron │Skills│ 设置 │
  └─────┴─────┴─────┴─────┴─────┘
  ```
- Canvas 全屏覆盖展示

## Color Tokens (Dark Mode Priority)

### Dark Mode（默认）
| Element | Color | Token |
|---------|-------|-------|
| App Background | #000000 | bg-black |
| Sidebar Background | #0A0A0A | bg-neutral-950 |
| Content Background | #000000 | bg-black |
| Canvas Background | #0A0A0A | bg-neutral-950 |
| Primary Text | #FFFFFF | text-white |
| Secondary Text | #CCCCCC | text-neutral-300 |
| Tertiary Text | #777777 | text-neutral-500 |
| Border | #292929 | border-neutral-800 |
| Active Nav Item | #FFFFFF (text) + #1A1A1A (bg) | — |
| Hover | #141414 | bg-neutral-900 |
| Accent/Brand | #FF8800 | text-orange-500 |
| CTA Button | #FFFFFF bg + #000000 text | — |
| Code Block Background | #141414 | bg-neutral-900 |
| Input Background | #141414 | bg-neutral-900 |
| Unread Badge | #FF8800 | bg-orange-500 |

### Light Mode
| Element | Color | Token |
|---------|-------|-------|
| App Background | #FAFAFA | bg-neutral-50 |
| Sidebar Background | #F5F5F5 | bg-neutral-100 |
| Content Background | #FAFAFA | bg-neutral-50 |
| Primary Text | #000000 | text-black |
| Secondary Text | #333333 | text-neutral-700 |
| Tertiary Text | #666666 | text-neutral-500 |
| Border | #D6D6D6 | border-neutral-300 |
| Active Nav Item | #000000 (text) + #EBEBEB (bg) | — |
| CTA Button | #000000 bg + #FFFFFF text | — |
| Code Block Background | #000000 | bg-black |

## Typography in Shell

| Element | Font | Size | Weight | Transform |
|---------|------|------|--------|-----------|
| Server Name | IBM Plex Mono | 14px | 700 | UPPERCASE |
| Category Header | IBM Plex Mono | 11px | 700 | UPPERCASE |
| Channel Name | IBM Plex Sans | 14px | 400 | none |
| Channel Active | IBM Plex Sans | 14px | 600 | none |
| Header Title | IBM Plex Mono | 16px | 700 | UPPERCASE |
| Body Text | IBM Plex Sans | 14px | 400 | none |
| Code | IBM Plex Mono | 12px | 400 | none |
| Label/Badge | IBM Plex Mono | 10px | 500 | UPPERCASE |
| Input Text | IBM Plex Sans | 14px | 400 | none |
| User Name | IBM Plex Sans | 13px | 500 | none |
| Tab Bar Label | IBM Plex Mono | 10px | 500 | UPPERCASE |

## Interaction Patterns
- **Channel switching**: 点击即切换，无过渡动画（brutalist 风格）
- **Category fold**: 点击 Category header 折叠/展开，无动画
- **Canvas toggle**: 点击触发，无滑动动画——瞬间出现/消失
- **未读标识**: Channel 名右侧 orange dot（1-9 显示数字，9+ 显示 9+）
- **Hover states**: 背景色变化，无其他效果

## Design Notes
- 全站无 border-radius——这是最强视觉标识，不可妥协
- Orange 仅用于需要注意力的元素（未读、NEW 标签、错误）
- 暗色模式使用 True Black (#000)，不是 Dark Gray
- 无阴影、无渐变、无模糊——完全扁平
- 所有 Mono 字体的文字强制大写（Category、Header、Label、Badge）
- 交互无动画——瞬间切换，brutalist 风格
