<!-- 用途: Agent 文档导航索引，一个文件定位所有文档 | 适用: Agent -->

# 文档索引

> Agent 读这一个文件，就知道该去读哪篇。

## 核心文档

| 文件 | 用途 | 适用场景 |
|------|------|---------|
| [GETTING-STARTED.md](GETTING-STARTED.md) | 安装后第一步路线图 | 新用户初始化、不知道从哪开始 |
| [SETUP-GUIDE.md](SETUP-GUIDE.md) | 详细配置指南（模型/频道/工具） | 配置 LLM、连接频道、首次设置 |
| [WORKSPACE.md](WORKSPACE.md) | Workspace 8 个核心文件的详解 | 理解/修改 SOUL.md、USER.md 等 |
| [MEMORY.md](MEMORY.md) | 记忆系统工作机制和 qmd 用法 | 记忆管理、qmd 命令、归档整理 |
| [ARCHITECTURE.md](ARCHITECTURE.md) | 系统架构、组件关系、数据流 | 理解全局架构、排查组件问题 |
| [SKILLS-GUIDE.md](SKILLS-GUIDE.md) | Skills 三层体系和内置 skill 列表 | 了解有哪些 skill、怎么安装 |
| [CUSTOM-SKILLS.md](CUSTOM-SKILLS.md) | 自定义 Skill 开发完整教程 | 写新 skill、SKILL.md 格式、发布 |
| [CRON-FLEET.md](CRON-FLEET.md) | Cron 定时任务配置和管理 | 设置自动任务、Cron 排错 |
| [GATES.md](GATES.md) | Pre-push 9 道质量门禁详解 | 理解 Git hook、提交被拦截时 |
| [OPS.md](OPS.md) | 日常运维（日志/备份/监控/清理） | Day 2 运维、磁盘清理、服务管理 |
| [UPGRADE.md](UPGRADE.md) | 升级流程和注意事项 | 升级 ClawKing 版本 |
| [TROUBLESHOOTING.md](TROUBLESHOOTING.md) | 常见问题排查 | 出错了、服务挂了、连不上 |
| [FAQ.md](FAQ.md) | 常见问题问答 | 快速查答案 |

## 工具指南（docs/guides/）

| 文件 | 用途 | 适用场景 |
|------|------|---------|
| [channels-overview.md](guides/channels-overview.md) | 全频道配置总览 | 选频道、配置非 Discord 频道 |
| [discord.md](guides/discord.md) | Discord Bot 详细配置 | Discord 连接、权限、线程 |
| [codex.md](guides/codex.md) | Codex CLI 编码代理指南 | 安装配置 Codex |
| [claude-code.md](guides/claude-code.md) | Claude Code 编码代理指南 | 安装配置 Claude Code |
| ~~gemini.md~~ | *(已移除 — Gemini CLI 不再使用)* | — |
| [oracle.md](guides/oracle.md) | Oracle 代码审查工具 | 代码审查、spec 审查 |
| [github.md](guides/github.md) | GitHub CLI 集成 | PR、Issue、CI 操作 |
| [browser.md](guides/browser.md) | 浏览器自动化配置 | Chrome CDP、截图、测试 |
| [mcp-bridge.md](guides/mcp-bridge.md) | MCP Bridge 配置 | MCP 工具集成 |
| [1password.md](guides/1password.md) | 1Password CLI 集成 | 密钥管理 |
| [tailscale.md](guides/tailscale.md) | Tailscale 远程访问 | 远程连接、跨设备 |
| [cloudflare.md](guides/cloudflare.md) | Cloudflare 服务集成 | CDN、R2 存储 |
| [web-search.md](guides/web-search.md) | Web 搜索配置 | AI 联网搜索 |
| [prerequisites.md](guides/prerequisites.md) | 安装前置依赖 | Homebrew、Node.js、Python |
