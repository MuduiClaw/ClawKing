# Section: Skills Market — 技能市场

## 功能描述
ClawHub 生态对接——浏览、搜索、安装、管理 Agent Skills。Skills 是 ClawKing 的扩展机制——用户通过安装 Skills 让 Agent 获得新能力（类似 App Store）。

## 信息架构
```
┌─────────────────────────────────────────┐
│  Panel Header                            │
│  SKILLS (47 installed)  [搜索]          │
├─────────────────────────────────────────┤
│  Tab: [INSTALLED] [MARKET] [UPDATES]    │
├─────────────────────────────────────────┤
│                                         │
│  ┌── Skill Card ────────────────────┐   │
│  │  📧 himalaya                      │   │
│  │  CLI to manage emails via IMAP    │   │
│  │  v2.1.0 · ★ 4.8 · 1.2k installs │   │
│  │  [INSTALLED ✓]                    │   │
│  └──────────────────────────────────┘   │
│                                         │
│  ┌── Skill Card ────────────────────┐   │
│  │  🐦 bird                          │   │
│  │  X (Twitter) CLI for reading...   │   │
│  │  v3.0.1 · ★ 4.5 · 890 installs  │   │
│  │  [INSTALL]                        │   │
│  └──────────────────────────────────┘   │
│                                         │
│  Featured / Categories                   │
│  [内容运营] [数据分析] [社交媒体]       │
│  [邮件管理] [开发工具] [自动化]         │
│                                         │
└─────────────────────────────────────────┘
```

## 数据模型

```typescript
interface Skill {
  id: string
  name: string
  description: string
  version: string
  author: string
  icon?: string                  // Emoji 或图标 URL
  rating?: number                // 0-5
  installCount?: number
  isInstalled: boolean
  isUpdateAvailable?: boolean
  categories: string[]
  lastUpdated?: number
}

interface SkillsMarketProps {
  skills: Skill[]
  installedCount: number
  tab?: 'installed' | 'market' | 'updates'
  searchQuery?: string
  selectedCategory?: string
  onTabChange?: (tab: string) => void
  onSearch?: (query: string) => void
  onInstall?: (skillId: string) => void
  onUninstall?: (skillId: string) => void
  onUpdate?: (skillId: string) => void
  onViewDetail?: (skillId: string) => void
  onCategorySelect?: (category: string) => void
}

interface SkillDetail {
  skill: Skill
  readme: string                 // Markdown
  changelog?: string
  configuration?: SkillConfig[]
}

interface SkillConfig {
  key: string
  label: string
  type: 'string' | 'number' | 'boolean' | 'select'
  value?: unknown
  options?: { label: string; value: string }[]
  required?: boolean
}
```

## 交互流程

### 浏览 Skills
1. 侧边栏底栏点击 Skills 图标 / 移动端 Tab Bar 点击 SKILLS
2. 默认显示 INSTALLED tab（已安装列表）
3. 切换 MARKET tab 查看市场全部 Skills
4. 分类标签筛选 + 搜索框

### 安装 Skill
1. 点击卡片上的 `INSTALL` 按钮
2. 按钮变为 loading 状态（脉冲 + INSTALLING...）
3. 完成 → 按钮变为 `INSTALLED ✓`（success 绿色）
4. Agent 自动获得该 Skill 能力

### 查看详情
- 点击卡片 → 展开详情面板（Mobile 全屏，Desktop 右侧浮层或 Canvas）
- 显示: README + 版本号 + 更新日志 + 配置项
- 配置项可直接编辑保存

### 更新
- UPDATES tab 显示可更新的 Skills
- `UPDATE ALL` 按钮批量更新
- 单个更新按钮

## 视觉规格

### Skill Card
- 容器: border 1px · border-neutral-300 dark:border-neutral-800 · p-4 · hover:border-neutral-500
- 图标: 24×24 emoji / 图片
- 名称: font-mono 14px 700
- 描述: font-sans 13px · text-neutral-500 · 单行截断
- 元信息: font-mono 11px · text-neutral-400（版本/评分/安装数）
- 安装按钮: Button variant=primary size=sm（未装）/ Badge variant=success（已装）
- 卡片布局: 网格 2 列（Desktop）/ 单列（Mobile）

### Category Tags
- font-mono 11px UPPERCASE
- bg-neutral-200 dark:bg-neutral-800 · px-2 py-1
- hover: bg-neutral-300 dark:bg-neutral-700
- 选中: bg-black text-white dark:bg-white dark:text-black

### Search
- 与侧边栏搜索框样式一致
- 结果实时过滤

## 响应式行为

### Desktop
- 面板/浮层形式
- 卡片 2 列网格

### Mobile
- 全屏展示
- 卡片单列
- 搜索框固定顶部

## 空状态

### 无已装 Skills
- `NO SKILLS INSTALLED` + `浏览市场安装你的第一个 Skill`
- CTA: `BROWSE MARKET`

### 搜索无结果
- `NO RESULTS FOR "{query}"` + `尝试其他关键词`
