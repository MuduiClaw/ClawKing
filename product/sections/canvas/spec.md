# Section: Canvas — 富文档面板

## 功能描述
右侧可折叠面板，展示 Agent 生成的长篇产出：报告、邮件预览、代码文件、数据表格。Canvas 是"深度阅读区"——消息流负责对话节奏，Canvas 负责沉浸式内容消费。

## 信息架构
```
┌──────────────────────────────┐
│  Canvas Header               │
│  WEEKLY REPORT  [TOC] [📄] [✕]│
├──────────────────────────────┤
│  Table of Contents (可折叠)   │
│  1. 概述                      │
│  2. 竞品动态                  │
│  3. 数据趋势                  │
│  4. 建议                      │
├──────────────────────────────┤
│                              │
│  Content Area                │
│  (Markdown 完整渲染)          │
│  - 标题层级                   │
│  - 代码块（语法高亮）         │
│  - 表格                      │
│  - 图片                      │
│  - 引用块                    │
│                              │
│                              │
└──────────────────────────────┘
```

## 数据模型

```typescript
interface CanvasDocument {
  id: string
  title: string
  content: string               // Markdown 原文
  type: 'report' | 'email' | 'code' | 'table' | 'generic'
  createdAt: number
  sourceMessageId?: string      // 关联的消息 ID
}

interface CanvasPanelProps {
  document?: CanvasDocument
  isOpen: boolean
  onClose: () => void
  onExportPDF?: () => void
  onCopyMarkdown?: () => void
}
```

## 交互流程

### 打开 Canvas
1. 用户在消息流中点击 `→ 在 Canvas 中查看` 链接
2. Canvas 面板瞬间出现（无滑动动画）
3. 内容加载 + TOC 自动生成

### 导航
- TOC 点击 → 内容区滚动到对应章节
- 滚动内容区 → TOC 高亮当前章节（scroll spy）

### 导出
- 📄 按钮 → 下拉菜单：PDF 导出 / 复制 Markdown / 复制纯文本

### 关闭
- ✕ 按钮 → 面板瞬间消失
- 移动端：全屏覆盖，左上角返回按钮

## 视觉规格

### Header
- 高度: 48px
- 标题: font-mono 12px 700 UPPERCASE tracking-tight
- 操作按钮: text-neutral-500 hover:text-black dark:hover:text-white

### TOC
- 背景: bg-neutral-100 dark:bg-neutral-900
- 边框: border-b 1px
- 条目: font-sans 13px · text-neutral-500 · hover:text-black dark:hover:text-white
- 当前条目: text-black dark:text-white font-semibold + 左侧 2px orange 竖线

### Content Area
- 内边距: px-6 py-4
- 标题 H1: font-mono 20px 700 UPPERCASE · mb-4
- 标题 H2: font-mono 16px 700 UPPERCASE · mb-3 · mt-8
- 标题 H3: font-sans 14px 700 · mb-2 · mt-6
- 正文: font-sans 14px 400 · leading-relaxed · text-neutral-700 dark:text-neutral-300
- 代码块: bg-black dark:bg-neutral-900 · font-mono 12px · p-4 · border 1px
- 表格: border-collapse · border 1px · th=font-mono 11px UPPERCASE bg-neutral-100 dark:bg-neutral-900
- 引用: border-l-2 border-orange-500 · pl-4 · text-neutral-500 italic
- 图片: max-w-full · border 1px

## 响应式行为

### Desktop (>1280px)
- 固定宽度 400px · 右侧面板

### Tablet (768-1280px)
- Overlay 从右侧滑入 · 宽度 400px · 背景遮罩

### Mobile (<768px)
- 全屏覆盖
- 顶部返回按钮
- TOC 默认折叠为 hamburger

## 空状态
- 无文档时不显示 Canvas（面板关闭状态）
