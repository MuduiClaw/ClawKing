<!-- 用途: 记忆系统的工作机制、目录结构和 qmd 使用指南 | 适用: 用户/Agent -->

# 记忆系统指南

> AI 不只是每次对话从零开始——它有长期记忆。这篇讲记忆怎么工作、怎么维护。

## 为什么需要记忆

AI 的每次对话（session）是独立的——它不会自动记住上次聊了什么。

记忆系统解决这个问题：
- **跨对话连续性**：AI 记得你的项目、偏好、过去的决策
- **知识积累**：教训、经验、配置信息持久化
- **自我进化**：AI 从错误中学习，越用越好

## 架构总览

```
~/clawd/
├── MEMORY.md                  ← 索引入口（AI 每次对话必读）
├── memory/
│   ├── archive/               ← 分主题的知识库
│   │   ├── infrastructure.md  ← 基础设施配置
│   │   ├── projects.md        ← 项目信息
│   │   ├── lessons.md         ← 教训记录
│   │   └── decisions.md       ← 决策记录
│   └── journal/               ← 每日日记
│       ├── 2026-03-18.md
│       └── 2026-03-19.md
```

### 三层结构

| 层级 | 文件 | 作用 | 谁维护 |
|------|------|------|--------|
| **索引层** | `MEMORY.md` | 精简索引，一行一个知识点 | AI + 你 |
| **归档层** | `memory/archive/*.md` | 详细信息，按主题分文件 | AI + 你 |
| **日记层** | `memory/journal/YYYY-MM-DD.md` | 每日记录，自动生成 | AI |

**信息流**：AI 每次对话启动时读 MEMORY.md（索引），需要详细信息时用 `memory_search` 搜索归档层。

## MEMORY.md — 索引入口

这是 AI 每次对话都会读的文件。写在这里的内容 = AI 永远知道的事情。

**原则**：
- **精简**：每条信息一行，只写关键词和指针
- **索引，不是详情**：详细内容放 `memory/archive/`，这里只放"去哪找"
- **分区清晰**：用 `##` 标题分区（项目、工具、教训等）

**示例**：
```markdown
# MEMORY.md

> 精简索引。详细配置 → memory/archive/infrastructure.md

## 项目
- **项目 A**: React + Node.js，部署在 Vercel → memory/archive/projects.md
- **项目 B**: Python CLI 工具，PyPI 发布 → memory/archive/projects.md

## 工具
- **模型**: GPT-4o 为主，Sonnet 4 备选
- **编辑器**: VS Code + Cursor

## 教训
- API Key 轮换后要同步更新 .env → memory/archive/lessons.md
```

## memory/archive/ — 知识归档

按主题分文件存储详细信息。推荐的文件划分：

| 文件 | 存什么 |
|------|--------|
| `infrastructure.md` | 服务器、网络、域名、部署配置 |
| `projects.md` | 项目详情、技术栈、状态 |
| `lessons.md` | 踩过的坑、修复方案、最佳实践 |
| `decisions.md` | 重要决策的上下文和理由 |

你可以自由添加更多文件：`contacts.md`、`bookmarks.md`、`ideas.md` 等等。

**格式建议**：
```markdown
# 教训记录

## 2026-03-18: API 超时处理
- **触发场景**: 第三方 API 在高峰期超时
- **错误做法**: 无限重试
- **正确做法**: 指数退避 + 最大 3 次 + 熔断
- **复现次数**: 2
```

## memory/journal/ — 每日日记

AI 在配置了每日复盘 Cron 后，会自动生成日记：

```
memory/journal/
├── 2026-03-17.md
├── 2026-03-18.md
└── 2026-03-19.md
```

每篇日记包含：
- 当天完成的任务
- 重要决策
- 发现的问题
- 明日待办

> 日记由 AI 自动维护，通常不需要手动编辑。

## qmd — 语义搜索工具

`qmd` 是 ClawKing 内置的记忆搜索工具。AI 在对话中自动调用它，你也可以手动用。

### 基本用法

```bash
# 查看状态
qmd status

# 搜索记忆
qmd search "API 超时怎么处理"

# 嵌入新文件到向量库
qmd embed memory/archive/lessons.md

# 嵌入整个目录
qmd embed memory/
```

### 工作原理

1. `qmd embed` 把 Markdown 文件切成段落，生成向量嵌入，存入本地向量数据库
2. `qmd search` 把查询文本也转成向量，找到最相似的段落返回
3. AI 在对话中通过 `memory_search` 工具自动调用 qmd

### 常见操作

```bash
# 查看已索引的集合
qmd status

# 重建索引（文件大改后）
qmd rebuild

# 查看索引统计
qmd stats
```

## AI 如何使用记忆

AI 的记忆使用流程：

1. **对话开始**：自动读取 `MEMORY.md`（索引层）
2. **需要详情时**：调用 `memory_search("关键词")` 搜索归档层
3. **获取结果**：`memory_get(path, from, lines)` 读取具体段落
4. **学到新东西**：写入 `memory/archive/` 对应文件
5. **每日收尾**：复盘 Cron 生成 `memory/journal/` 日记

## 用户如何管理记忆

### 手动添加记忆

直接编辑文件：

```bash
# 往 MEMORY.md 加一行索引
echo "- **新项目**: 描述 → memory/archive/projects.md" >> ~/clawd/MEMORY.md

# 往归档文件加详情
cat >> ~/clawd/memory/archive/projects.md << 'EOF'

## 新项目
- 技术栈：Next.js + Supabase
- 仓库：github.com/xxx/yyy
- 状态：开发中
EOF
```

### 清理过期记忆

```bash
# 查看日记文件大小
du -sh ~/clawd/memory/journal/

# 归档旧日记（超过 30 天的）
mkdir -p ~/clawd/memory/journal/archive
find ~/clawd/memory/journal/ -name "*.md" -mtime +30 -exec mv {} ~/clawd/memory/journal/archive/ \;

# 重建索引
qmd rebuild
```

### 修正错误记忆

AI 有时会记错东西。直接改文件就行：

1. 找到错误内容：`grep -rn "错误的内容" ~/clawd/memory/`
2. 编辑文件修正
3. 重建索引：`qmd rebuild`

## 最佳实践

1. **MEMORY.md 保持精简**：< 200 行。太长会挤占 AI 的对话上下文
2. **归档文件定期整理**：删除过时信息，合并重复条目
3. **让 AI 自己维护**：大部分情况下不需要手动管理，AI 会自动更新
4. **重要信息写 MEMORY.md**：你希望 AI "永远知道"的事写在索引层
5. **敏感信息谨慎**：记忆文件是纯文本，不要存密码和 token

---

> 相关文档：[Workspace 文件详解](WORKSPACE.md) · [Cron Fleet 指南](CRON-FLEET.md) · [FAQ](FAQ.md)
