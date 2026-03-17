# E2B.dev Design System — 完整提取报告

> 提取时间: 2026-03-17
> 来源: https://e2b.dev (Chrome DevTools CSS 变量 + 视觉分析)

---

## 🎨 设计语言: Technical Brutalism

E2B 采用"技术布鲁塔主义"美学——高对比度、极简、功利性设计。灵感来自 CLI、终端界面和工程文档。

**核心设计原则:**
- **Sharp Edges** — 全站 0px border-radius，无圆角
- **Monochrome + One** — 纯黑白为主，唯一彩色是 Safety Orange
- **Monospace First** — 标题全部使用等宽字体 + 大写
- **Flat & Brutalist** — 无阴影、无渐变、无深度层级
- **Functional Color** — 颜色仅在需要强调时出现（NEW 标签、品牌色）

---

## 🀄 中文字体栈 (Chinese Font Fallback)

ClawKing 面向中国市场，中文字体 fallback 必须明确：

```css
/* 标题 */
font-family: 'IBM Plex Mono', 'PingFang SC', 'Microsoft YaHei', 'Noto Sans SC', monospace;

/* 正文 */
font-family: 'IBM Plex Sans', 'PingFang SC', 'Microsoft YaHei', 'Noto Sans SC', sans-serif;

/* 代码 */
font-family: 'IBM Plex Mono', 'PingFang SC', 'Microsoft YaHei', monospace;
```

**平台覆盖：**
- macOS/iOS: PingFang SC（系统自带）
- Windows: Microsoft YaHei（系统自带）
- Android/Linux: Noto Sans SC（需自 host 或 Google Fonts）
- Electron 打包时 self-host IBM Plex 全家族 + Noto Sans SC subset

---

## 🎨 色彩系统 (CSS Variables)

### Light Mode
| Token | Value | 用途 |
|-------|-------|------|
| `--color--bg-primary` | `#FAFAFA` | 主背景 |
| `--color--bg-secondary` | `#EBEBEB` | 次级背景 |
| `--color--bg-tertiary` | `#E6E6E6` | 三级背景 |
| `--color--bg-codesnippet` | `#000000` | 代码块背景 |
| `--color--content-primary` | `#000000` | 主文字 |
| `--color--content-secondary` | `#333333` | 次级文字 |
| `--color--content-tertiary` | `#666666` | 三级文字 |
| `--color--content-quad` | `#999999` | 四级文字 |
| `--color--brand` | `#FF8800` | 品牌橙 (Safety Orange) |
| `--color--stroke-primary` | `#D6D6D6` | 主边框 |
| `--color--stroke-primary-hover` | `#B8B8B8` | 边框 hover |
| `--color--stroke-secondary` | `#EBEBEB` | 次级边框 |
| `--color--cta-primary` | `#000000` | CTA 按钮背景 |
| `--color--cta-primary-hover` | `#1F1F1F` | CTA 按钮 hover |
| `--color--content-positive` | `#49A147` | 正面/成功 |
| `--color--content-negative` | `#EB361C` | 负面/错误 |
| `--color--content-warning` | `#F5A623` | 警告/降级 |

### Dark Mode
| Token | Value | 用途 |
|-------|-------|------|
| `--dark--bg-primary` | `#000000` | 主背景 (True Black) |
| `--dark--bg-secondary` | `#141414` | 次级背景 |
| `--dark--bg-tertiary` | `#1A1A1A` | 三级背景 |
| `--dark--bg-codesnippet` | `#141414` | 代码块背景 |
| `--dark--content-primary` | `#FFFFFF` | 主文字 |
| `--dark--content-secondary` | `#CCCCCC` | 次级文字 |
| `--dark--content-tertiary` | `#777777` | 三级文字 |
| `--dark--content-quad` | `#666666` | 四级文字 |
| `--dark--stroke-primary` | `#292929` | 主边框 |
| `--dark--stroke-primary-hover` | `#3D3D3D` | 边框 hover |
| `--dark--cta-primary` | `#FFFFFF` | CTA 按钮背景 |
| `--dark--cta-primary-hover` | `#EBEBEB` | CTA 按钮 hover |
| `--dark--content-on-black` | `#000000` | 反色文字 |

### 品牌/合作伙伴配色
| Token | Value | 用途 |
|-------|-------|------|
| `--color--accent-openai` | `orangered` | OpenAI 品牌色 |
| `--color--accent-anthropic` | `#CC7D5D` | Anthropic 品牌色 |
| `--color--accent-mistral` | `#FFA300` | Mistral 品牌色 |
| `--color--accent-meta` | `#0467DF` | Meta 品牌色 |
| `--color--accent-gemini` | `#8E75B2` | Gemini 品牌色 |
| `--color--brand-jsts-bg` | `#F7DF1E` | JavaScript 黄 |
| `--color--brand-python-bg` | `#3776AB` | Python 蓝 |

---

## 📝 字体系统

### 字体族
| 角色 | 字体 | 来源 |
|------|------|------|
| **标题** | IBM Plex Mono 700 | Google Fonts |
| **正文** | IBM Plex Sans | Google Fonts |
| **代码/等宽** | IBM Plex Mono 400/500 | Google Fonts |

### 字体层级
| 元素 | 字体 | 字号 | 字重 | 行高 | 字距 | 大小写 |
|------|------|------|------|------|------|--------|
| H1 | IBM Plex Mono | 32px | 700 | 32px (1.0) | -0.32px | UPPERCASE |
| H2 | IBM Plex Mono | 28px | 700 | 28px (1.0) | -0.8px | UPPERCASE |
| H3 | IBM Plex Sans | 16px | 700 | 20px (1.25) | normal | none |
| Body | IBM Plex Sans | 14px | 400 | 20px (1.43) | normal | none |
| Label/Tag | IBM Plex Mono | 12px | 400 | 14px (1.17) | normal | UPPERCASE |
| Code | IBM Plex Mono | 12px | 400 | — | — | none |

**关键规律:**
- 标题行高 = 字号 (1.0 紧凑比)
- 负字距 (tight tracking) 用于大标题
- 所有 Mono 标题强制大写
- Sans 用于可读性优先的正文

---

## 📏 间距系统 (Spacing Scale)

基于 4px 基数的间距刻度：

| Token | Value | 用途 |
|-------|-------|------|
| `space-1` | 4px | 紧凑内间距（badge 内、icon 间距） |
| `space-2` | 8px | 列表项间距、小组件内边距 |
| `space-3` | 12px | 按钮内边距、输入框内边距 |
| `space-4` | 16px | 卡片内边距、段落间距 |
| `space-6` | 24px | 区块间距、Section 分隔 |
| `space-8` | 32px | 大区块间距、页面边距 |
| `space-12` | 48px | 页面顶部/底部留白 |
| `space-16` | 64px | Hero 区块间距 |

**Tailwind 映射：** 直接使用 Tailwind 默认 spacing scale（`p-1` = 4px, `p-2` = 8px, ...），不自定义。

---

## 📐 间距与布局

| 属性 | 值 | 说明 |
|------|------|------|
| Border Radius | **0px** | 全站无圆角，核心设计决策 |
| 主内容区 | 居中垂直堆叠 | 不做复杂多列布局 |
| 边框粗细 | 1px solid | 极细线条定义结构 |
| 按钮内边距 | 偏大 ("chunky") | 增强点击感 |

---

## 🔘 按钮样式

### Primary CTA
```
background: #000000 (light) / #FFFFFF (dark)
color: #FFFFFF (light) / #000000 (dark)
font: IBM Plex Mono, uppercase
border: none
border-radius: 0px
padding: generous
```

### Secondary/Ghost
```
background: transparent
color: #000000 (light) / #FFFFFF (dark)
font: IBM Plex Mono, uppercase
border: 1px solid #D6D6D6 (light) / #292929 (dark)
border-radius: 0px
```

---

## 🗺️ Tailwind 映射建议

基于 E2B 设计系统到 Tailwind CSS v4 的映射:

| E2B Token | Tailwind Class |
|-----------|----------------|
| Background primary | `bg-neutral-50` / `dark:bg-black` |
| Background secondary | `bg-neutral-200` / `dark:bg-neutral-900` |
| Text primary | `text-black` / `dark:text-white` |
| Text secondary | `text-neutral-700` / `dark:text-neutral-300` |
| Text tertiary | `text-neutral-500` / `dark:text-neutral-500` |
| Brand accent | `text-orange-500` / `bg-orange-500` |
| Border | `border-neutral-300` / `dark:border-neutral-800` |
| CTA button | `bg-black text-white` / `dark:bg-white dark:text-black` |
| All headings | `font-mono uppercase tracking-tight` |
| Body text | `font-sans` |
| Border radius | `rounded-none` (全局) |

---

## 🔑 ClawKing 项目应用要点

1. **全站 `rounded-none`** — 这是 E2B 最鲜明的视觉标识
2. **IBM Plex 字体族** — `heading: Mono Bold + uppercase`, `body: Sans Regular`
3. **极简配色** — 黑白为主，橙色只用于强调（NEW 标签、品牌色）
4. **反转 CTA** — Light 模式黑底白字，Dark 模式白底黑字
5. **代码块** — 始终黑底（light 模式也是），用 Mono 400/500
6. **边框** — 极细 1px 灰线定义空间，不用阴影
