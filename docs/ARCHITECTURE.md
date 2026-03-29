# Architecture

> OpenClaw 系统架构概览，理解各组件如何协作。

## 核心架构

```
┌─────────────────────────────────────────────────────────────┐
│                    Chat Channels                             │
│              Discord / 飞书 / Telegram / Slack               │
└─────────────────┬───────────────────────────────────────────┘
                  │ WebSocket
┌─────────────────▼───────────────────────────────────────────┐
│                  OpenClaw Gateway                            │
│  ┌──────────┐ ┌────────┐ ┌──────┐ ┌────────┐ ┌──────────┐ │
│  │  Router   │ │ Agent  │ │ Cron │ │ Memory │ │  Skills  │ │
│  │          │ │ Engine │ │Fleet │ │ (qmd)  │ │          │ │
│  └──────────┘ └────────┘ └──────┘ └────────┘ └──────────┘ │
│  Port: 3456                                                 │
└────────┬──────────┬──────────┬──────────────────────────────┘
         │          │          │
    ┌────▼───┐ ┌───▼────┐
    │ Codex  │ │ Claude │
    │        │ │  Code  │
    └────────┘ └────────┘
      Coding Agents (ACP)

┌─────────────────────────────────────────────────────────────┐
│              infra-dashboard (localhost:3001)                 │
│  Gateway 状态 │ Cron 监控 │ 模型用量 │ Session 列表          │
└─────────────────────────────────────────────────────────────┘
```

## 组件说明

### Gateway
OpenClaw 的核心进程。负责：
- 接收 Chat Channel 消息
- 调度 Agent 推理（LLM API 调用）
- 管理 Cron 定时任务
- 提供 WebSocket API
- 工具调用 (tools) 执行

配置：`~/.openclaw/openclaw.json`
日志：`~/.openclaw/logs/`

### Cron Fleet
定时任务舰队。每个 cron job 是一个 prompt 模板，按设定频率触发 agent 执行。
详见 [CRON-FLEET.md](./CRON-FLEET.md)

### Memory System (qmd)
语义搜索引擎，让 AI 能检索历史记忆和知识。
- 后端：qmd（本地向量数据库）
- Collections：`memory-root-main`（MEMORY.md）、`memory-dir-main`（journal + archive）
- Wrapper：`~/.openclaw/scripts/qmd-safe.sh`

### Coding Agents (ACP)
Agent Control Protocol，让 AI 调度 coding agents：
- **Codex** — OpenAI 的 coding agent（默认首选）
- **Claude Code** — Anthropic 的 coding agent

AI 根据任务复杂度自动选择合适的 agent。

### infra-dashboard
Next.js 监控面板，运行在 `localhost:3001`：
- Gateway 运行状态
- Cron job 执行历史
- 模型调用用量
- Active session 列表

### MCP Bridge
Model Context Protocol 桥接服务，让 AI 使用外部工具：
- **context7** — 实时文档查询
- **deepwiki** — GitHub repo 知识库

### LaunchAgents
macOS 后台服务，确保关键进程常驻：

| 服务 | Label | 用途 |
|------|-------|------|
| Gateway | `ai.openclaw.gateway` | 核心进程（OpenClaw 管理） |
| Guardian | `ai.openclaw.guardian` | Gateway 看门狗 |
| Dashboard | `com.openclaw.infra-dashboard` | 监控面板 |
| Backup | `ai.openclaw.backup` | Git 自动备份 |
| Log Rotate | `ai.openclaw.log-rotate` | 日志轮转 |
| Session Prune | `ai.openclaw.sessions-prune-cron` | Session 清理 |
| MCP Bridge | `com.openclaw.mcp-bridge` | MCP 服务 |

## 数据流

```
用户消息 → Discord/飞书 → Gateway → Agent Engine → LLM API
                                         ↓
                                    Tool Calls
                                    ├── exec (shell)
                                    ├── read/write (files)
                                    ├── memory_search (qmd)
                                    ├── message (reply)
                                    └── sessions_spawn (sub-agent)
```

## 文件系统

Workspace 文件分为两类：**用户自定义**（升级不覆盖）和**系统核心**（升级时覆盖+备份）。

```
~/clawd/                    ← Workspace (AI 的工作目录)
│
│ ── 用户自定义（升级永不覆盖）──
├── SOUL.md                 ← AI 人格定义
├── IDENTITY.md             ← AI 身份与自我认知
├── USER.md                 ← 用户画像与偏好
├── AGENTS.md               ← 行为规则 (The Loop)
├── TOOLS.md                ← 工具索引与安全红线
├── MEMORY.md               ← 核心记忆索引
├── HEARTBEAT.md            ← 心跳协议
├── BOOTSTRAP.md            ← 启动任务
│
│ ── 记忆系统 ──
├── memory/
│   ├── archive/            ← 按主题的知识归档
│   │   ├── infrastructure.md
│   │   ├── projects.md
│   │   ├── lessons.md
│   │   └── decisions.md
│   └── journal/            ← 每日自动日记
│       └── YYYY-MM-DD.md
│
│ ── 系统核心（升级时覆盖 + .bak 备份）──
├── skills/                 ← 自定义 skills
├── scripts/                ← 自动化脚本
├── prompts/                ← Cron prompt 模板
└── tasks/                  ← 任务 spec

~/.openclaw/                ← State (运行状态)
├── openclaw.json           ← 配置文件（用 config.patch 修改）
├── logs/
│   ├── err.log             ← Gateway 错误日志
│   ├── access.log          ← API 请求日志
│   └── guardian.log        ← Guardian 恢复日志
├── scripts/                ← 服务脚本
└── sessions/               ← Session 数据

~/Library/LaunchAgents/     ← macOS 服务
└── ai.openclaw.*.plist
```

> 📖 每个 workspace 文件的详细说明见 [Workspace 文件详解](WORKSPACE.md)。

### 记忆架构

AI 的记忆是三层结构，信息密度递减：

```
MEMORY.md（索引层）──→ AI 每次对话必读，精简到一行一条
    │
    ├─→ memory/archive/（归档层）──→ 详细信息，按需用 memory_search 检索
    │
    └─→ memory/journal/（日记层）──→ 每日自动生成，记录当天工作
         │
         └─→ qmd（语义搜索）──→ 向量嵌入，支持自然语言查询
```

> 📖 详细的记忆系统使用方法见 [记忆系统指南](MEMORY.md)。

### Gate 体系

代码提交通过 `git push` 触发 pre-push hook，自动执行 9 道质量门禁：

| Gate | 检查项 | 说明 |
|------|--------|------|
| 1 | Conventional Commits | 提交消息格式校验 |
| 2 | Spec 引用 | 变更须关联 task spec |
| 3 | Tree-hash 防伪 | 验证提交完整性 |
| 4 | TDD | 测试覆盖检查 |
| 5 | Typecheck | 类型检查（如适用） |
| 6 | E2E | 端到端测试 |
| 7 | UI 验收截图 | 动态 UI 验收（截图+视觉去重） |
| 8 | Scope-ack | 变更范围确认 |
| 9 | CDP 浏览器验证 | 自动浏览器验收 |

> 📖 详细的 Gate 配置见 [GATES.md](GATES.md)。

## 端口

| 端口 | 服务 | 说明 |
|------|------|------|
| 3456 | Gateway | OpenClaw 核心 |
| 3001 | Dashboard | 监控面板 |
| 9100 | MCP Bridge | MCP 服务 |
