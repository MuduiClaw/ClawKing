# Spec: ClawKing Design System — E2B Technical Brutalism

> **Status**: approved
> **Author**: Partner
> **Created**: 2026-03-17

## 一句话

从 e2b.dev 提取完整设计规范（色彩/字体/间距/组件样式），建立 ClawKing 的 Design System + App Shell 骨架组件，为后续 Section 实现提供统一视觉基础。

## 背景

ClawKing 是面向中国市场的 Agent 客户端（桌面 Electron + 移动 RN）。产品定位在 charter-v2.7 中已确定。需要建立设计系统作为所有 UI 实现的基础。

选择 E2B 的 Technical Brutalism 风格作为参考：高对比度、0px 圆角、IBM Plex 字体族、极简扁平——与 Agent/开发者工具的产品调性高度契合。

**当前状态**：Design Tokens 已从 e2b.dev 通过 Chrome DevTools 提取完毕，Shell 骨架组件已产出初版。需要 Oracle 审核设计决策和文件质量。

## 设计决策

### 视觉语言
- **风格**: Technical Brutalism — 灵感来自 CLI/终端界面
- **Border Radius**: 0px 全局无例外（最强视觉标识）
- **深度模型**: 完全扁平——无 box-shadow、无渐变、无模糊
- **配色**: Dark mode 优先（True Black #000），Light mode 同步支持
- **强调色**: Safety Orange #FF8800（仅用于未读、NEW 标签、品牌强调——克制使用）
- **交互**: 无动画，瞬间切换（brutalist 风格）

### 字体系统
| 角色 | 字体 | 规则 |
|------|------|------|
| 标题/Category/Label/Badge | IBM Plex Mono 700 | 强制 UPPERCASE + tight tracking |
| 正文/Channel 名/输入 | IBM Plex Sans 400/500 | 正常大小写 |
| 代码 | IBM Plex Mono 400 | 正常大小写 |

### Shell 布局（对齐 Discord 客户端模型）
```
桌面端:
┌──────────┬────────────────────────┬────────────┐
│ Sidebar  │  Content (消息流)       │  Canvas    │
│ 260px    │  flex-1                │  400px     │
│          │                        │  (可折叠)   │
└──────────┴────────────────────────┴────────────┘

移动端:
┌─────────────────────────────────┐
│  Content (消息流)                │
│                                 │
├─────┬─────┬─────┬─────┬─────────┤
│Chat │Agent│Cron │Skills│Settings│  ← Tab Bar
└─────┴─────┴─────┴─────┴─────────┘
```

### Dark Mode 色彩映射
| Element | Hex | Tailwind |
|---------|-----|----------|
| App BG | #000000 | bg-black |
| Sidebar BG | #0A0A0A | bg-neutral-950 |
| Text Primary | #FFFFFF | text-white |
| Text Secondary | #CCCCCC | text-neutral-300 |
| Text Tertiary | #777777 | text-neutral-500 |
| Border | #292929 | border-neutral-800 |
| Input/Code BG | #141414 | bg-neutral-900 |
| Accent | #FF8800 | text-orange-500 |
| CTA Button | #FFFFFF bg / #000000 text | — |

### Light Mode 色彩映射
| Element | Hex | Tailwind |
|---------|-----|----------|
| App BG | #FAFAFA | bg-neutral-50 |
| Sidebar BG | #F5F5F5 | bg-neutral-100 |
| Text Primary | #000000 | text-black |
| Text Secondary | #333333 | text-neutral-700 |
| Border | #D6D6D6 | border-neutral-300 |
| Code BG | #000000 | bg-black |
| CTA Button | #000000 bg / #FFFFFF text | — |

## 交付物

### T1: Design Tokens（已完成）
- **改什么**: `product/design-system/` 目录
- **产出文件**:
  - `colors.json` — 调色板定义
  - `typography.json` — 字体选择
  - `e2b-design-spec.md` — 完整提取报告（CSS 变量表、字体层级、间距、按钮样式、Tailwind 映射）
- **怎么验**: 文件存在 + CSS 变量值与 e2b.dev 实际一致
- **不做什么**: 不实现 CSS-in-JS 或 Tailwind 配置文件（v4 不需要 tailwind.config.js）
- **影响**: 所有后续 UI 组件的视觉基础

### T2: Product Definition（已完成）
- **改什么**: `product/` 根目录
- **产出文件**:
  - `product-overview.md` — 基于 charter-v2.7 的产品定义（名称/问题/方案/用户/商业模式）
  - `product-roadmap.md` — 8 个 Section 定义 + 导航模型
- **怎么验**: 内容与 charter-v2.7 对齐，Section 覆盖 charter §4.3-§4.12 的核心功能模块
- **不做什么**: 不重复 charter 全文，只提取 design-os 流程需要的结构化信息
- **影响**: Shell 设计和 Section Shape 的输入

### T3: App Shell Spec + 组件（已完成）
- **改什么**: `product/shell/` + `src/shell/`
- **产出文件**:
  - `product/shell/spec.md` — 完整 Shell 规范（布局/导航/配色/字体/响应式/交互）
  - `src/shell/components/AppShell.tsx` — 三栏主骨架
  - `src/shell/components/MainNav.tsx` — 左侧导航（Server 切换 + 搜索 + Category/Channel 树）
  - `src/shell/components/UserMenu.tsx` — 底栏（头像 + Skills/Usage/Settings 图标）
  - `src/shell/components/MobileTabBar.tsx` — 移动端 5-tab 底栏
  - `src/shell/components/index.ts` — 导出
  - `src/shell/ShellPreview.tsx` — 带模拟数据的完整预览
- **怎么验**: 
  - 组件 TypeScript 类型完整（所有 props 有类型定义）
  - 设计 token 已应用（0px rounded、IBM Plex 字体、Dark/Light 双模式配色）
  - Props-based 设计（无硬编码数据，全部通过 props 传入）
  - 响应式三档（Desktop/Tablet/Mobile）
  - ShellPreview 包含 Agent 消息类型示例（Thinking/ToolCall/CronOutput）
- **不做什么**: 不搭建 Vite/Next.js 项目脚手架、不装依赖、不跑 dev server
- **影响**: 后续 Section 的 Screen Design 都将嵌入这个 Shell

### T3.5: Base UI Components（已完成 — Oracle R1 修复）
- **改什么**: `src/shell/components/ui/` 目录
- **产出文件**:
  - `Button.tsx` — 4 变体 (primary/secondary/ghost/danger) × 3 尺寸 (sm/md/lg)
  - `TextInput.tsx` — 带 label + error 状态
  - `Badge.tsx` — 5 变体 (default/accent/success/warning/danger)
  - `Modal.tsx` — 对话框（backdrop + 标题 + 关闭）
  - `index.ts` — 导出
- **怎么验**: 全部使用标准 Tailwind class（无硬编码 hex）、rounded-none、dark mode 支持
- **不做什么**: 不做 Select/Dropdown/Tooltip（T4 Section 需要时按需添加）
- **影响**: T5 Screen Design 的原子级依赖

### T4: Shape Sections（待执行）
- **改什么**: `product/sections/{section-id}/spec.md`
- **计划产出**: 8 个 Section 的结构化 spec（按 roadmap 定义）
  - `home/spec.md` — 消息流 + 输入区 + Agent 消息类型渲染
  - `channel-list/spec.md` — 已在 Shell 中覆盖（侧边栏）
  - `canvas/spec.md` — 富文档面板
  - `cron-panel/spec.md` — 定时任务管理
  - `skills-market/spec.md` — ClawHub 对接
  - `settings/spec.md` — 设置中心
  - `usage-dashboard/spec.md` — 用量仪表盘
  - `onboarding/spec.md` — 引导流程
- **怎么验**: 每个 spec 包含：功能描述 / 数据模型 / 交互流程 / 视觉规格 / 响应式行为
- **不做什么**: 不写 Screen Design 组件代码（那是下一步）
- **影响**: Screen Design（T5）的直接输入

### T5: Screen Design 组件（待执行，依赖 T4）
- **改什么**: `src/sections/{section-id}/components/`
- **怎么验**: 组件 props-based + design tokens applied + responsive + dark mode
- **不做什么**: 不实现真实 API 调用或状态管理
- **影响**: 最终 coding agent 的开发交接物

## 不做什么

- 不搭建项目脚手架（package.json/tsconfig/vite.config 等）——后续由 coding agent 完成
- 不实现真实数据流或 API 调用——组件纯展示层
- 不做动效设计——brutalist 风格明确无动画
- 不改 charter 或 AGENTS.md
- 不涉及 Cloud Server 架构或 Go 后端

## 执行顺序

T1 ✅ → T2 ✅ → T3 ✅ → Oracle R1 修复 ✅ → T3.5 ✅ → Oracle R2 审核 → T4 → T5

## 风险

- **字体加载**: IBM Plex 需要 Google Fonts CDN，中国用户可能加载慢。应对：后续打包时 self-host 字体文件
- **E2B 风格过于开发者向**: 目标用户是老板不是开发者。应对：brutalism 的骨架保留（无圆角/扁平/高对比度），但 Section 设计中适度增加可读性（行间距/留白/信息层级）
- **Tailwind v4 兼容性**: 部分 utility 名称变更。应对：组件中使用标准 Tailwind class，不依赖 v3 废弃写法

---

## Status 流转

draft → Oracle R1 FAIL → R1 修复 → Oracle R2 PASS → **approved** → in_progress (T4-T5) → done

## Oracle Review

### R1 (2026-03-17) — FAIL → 3🔴 已修复

1. **🔴 硬编码色值 + `light:` 语法错误**: 所有组件重写，使用标准 Tailwind class（默认=light, `dark:`=dark），消除所有 `bg-[#hex]` 和 `light:` 变体
2. **🔴 中文字体缺失 + Warning 色缺失**: `e2b-design-spec.md` 补充中文字体栈（PingFang SC / Microsoft YaHei / Noto Sans SC）+ Warning color `#F5A623` + Spacing Scale
3. **🔴 缺少 Base UI 原子组件**: 新增 T3.5 步骤，产出 Button/TextInput/Badge/Modal 4 个基础组件

### R2 (2026-03-17) — PASS ✅

Oracle 确认 3 个 🔴 全部修复：
- 硬编码 hex 清零 + `light:` 语法清零 🟢
- 中文字体栈 + Warning 色 + Spacing Scale 到位 🟢
- Base UI 组件质量合格（4 组件 × dark mode × rounded-none） 🟢
- 空状态处理（servers=0 时显示 NO SERVERS）🟢
