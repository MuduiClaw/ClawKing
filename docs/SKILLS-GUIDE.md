# Skills 扩展指南

> 三层 Skills 体系：内置 → 自定义 → ClawHub 社区

## 什么是 Skill？

Skill 是 AI 的能力模块。每个 skill 是一个目录，包含 `SKILL.md`（行为指令）和可选的脚本/参考文档。AI 根据用户请求自动匹配并加载对应 skill。

```
my-skill/
├── SKILL.md           # 必须：AI 行为指令
├── references/        # 可选：参考文档
├── scripts/           # 可选：执行脚本
└── run.sh             # 可选：入口脚本
```

## 三层体系

### 1. 内置 Skills（50+）
随 OpenClaw 安装自动可用，包括：
- `weather` — 天气查询
- `github` — GitHub 操作
- `discord` — Discord 管理
- `coding-agent` — Coding agent 调度
- `1password` — 密码管理
- `tmux` — 终端会话管理
- ... 等等

查看所有内置 skills：
```bash
ls ~/.nvm/versions/node/*/lib/node_modules/openclaw/skills/
```

### 2. 自定义 Skills（23 个）
ClawKing 包含的 battle-tested skills：

| Skill | 用途 |
|-------|------|
| **brainstorming** | 创意/需求探索（任何创作前必用） |
| **planning-with-files** | 复杂任务的文件化计划 |
| **self-improving** | 自我改进协议 |
| **heartbeat-guide** | 心跳行为指南 |
| **canvas-design** | 可视化设计创作 |
| **frontend-design** | 前端 UI 设计 |
| **blueprint-infographic** | 信息图生成 |
| **design-os** | 产品设计系统 |
| **codebase-standards** | 代码规范发现 |
| **web-artifacts-builder** | Web 应用构建 |
| **webapp-testing** | Web 应用测试 |
| **crawl4ai** | 高性能网页爬取 |
| **gpt-researcher** | 深度研究 |
| **kb-rag** | 知识库 RAG |
| **find-skills** | 发现新 skills |
| **mcp-builder** | MCP server 开发 |
| **discord-ops** | Discord 运维 |
| **agent-guides** | Agent 能力文档 |
| **docx** | Word 文档操作 |
| **xlsx** | Excel 操作 |
| **pdf** | PDF 操作 |
| **product-manager-toolkit** | 产品管理工具 |
| **remotion-video-toolkit** | 视频制作 |

### 3. ClawHub 社区
社区贡献的 skills，通过 `clawhub` CLI 安装：

```bash
# 搜索
clawhub search "image generation"

# 安装
clawhub install skill-name

# 更新
clawhub update skill-name
```

浏览：<https://clawhub.com>

## 创建自己的 Skill

想写自己的 Skill？👉 **[自定义 Skill 开发指南](CUSTOM-SKILLS.md)** — 从零开始的完整教程，包含目录结构、SKILL.md 格式规范、测试方法和 ClawHub 发布流程。

## 常用操作

```bash
# 查看已安装 skills
openclaw skills list

# 搜索社区 skills
clawhub search "keyword"

# 安装社区 skill
clawhub install skill-name

# 从目录安装
openclaw skills install ./path/to/skill
```
