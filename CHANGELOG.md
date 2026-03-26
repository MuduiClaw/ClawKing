## [开发中]


### 🐛 修复

- setup.sh — version读取VERSION文件+输入校验+Tailscale daemon检测改进

---

# 更新日志

> ClawKing 🦞 — OpenClaw 开箱即用精装版

---

## [1.5.1] - 2026-03-26

### ✨ 新功能
- changelog 自动过滤 `[private]`/`[internal]` 标记的 commit，公开仓库不泄露内部信息

### 🐛 修复
- `cut-release.sh` 改为推单个 tag，不再 `--tags` 全推
- 清理 v1.5.0 changelog 中残留的私有产品引用

### 🔧 维护
- secrets scan 从项目级 `project-gates.sh` 移至全局 Gate 0.4
- 启用 `.spec-atomic-warn` 观察模式（scope 违规仅警告不阻断）
- 脚本数量更新 27 → 28

---

## [1.5.0] - 2026-03-19

### ✨ 新功能
- add verify-production.sh for Gate 8 production verification
- add cut-release.sh — one-command version release with tests

### 📖 文档
- 文档体系补全：新增 7 篇文档（安装后指南、Workspace 详解、记忆系统、频道总览、Gemini CLI、自定义 Skill、日常运维）+ Agent 导航索引
- SKILLS-GUIDE 修正 skill 数量 24→23，skill 创建教程迁移到独立文档
- ARCHITECTURE 扩展文件系统说明、记忆架构、Gate 体系
- README 文档导航表从 9 行扩展到 15 行

### 🐛 修复
- 替换外部图片链接为仓库本地图片
- 修正 config 文件名和 Gemini CLI 包名
- setup.sh 部署 .githooks 到 workspace + 修正 openclaw-wrapper 路径
- DOTFILES_DIR 统一引用 WORKSPACE_DIR（post-rsync 源）
- SSH detection works without sudo and skips GUI wait in non-interactive mode
- use nc instead of lsof for SSH detection

### 🔧 维护
- CHANGELOG 自动记录脚本修复：同类条目合并到已有标题下，不再重复创建 `###` 段
- add 7 bats tests for changelog merge + fix macOS sed compat


### 📖 文档

- AGENTS.md 自动教训沉淀

---

## [1.4.1] - 2026-03-17

> Bug fixes: 升级脚本加固 + cron 模板同步 + Dashboard 下载修复

### 🐛 修复

- **#14 cron 模板缺失**：setup.sh 部署时自动从 openclaw npm 包同步 `docs/reference/templates/`，修复 OpenClaw 3.12+ cron session 报错
- **#15 升级 ENOTEMPTY**：safe-upgrade-openclaw.sh 新增 Phase 2.5，npm install 前先停 gateway 释放文件锁
- Dashboard 下载使用 tag-based URL + 双仓库 fallback
- Dashboard 下载 grep pattern 兼容 GitHub API tag_name 格式
- 防止独立 tarball 覆盖源码仓库
- Gate 4 TDD 跳过 .gitkeep/.gitignore 等非代码文件
- Gate 7 混合任务日志正确引用 showboat report

### 📖 文档

- UPGRADE.md 路径修复
- spec 模板新增 showboat 验证段落
- showboat 验收证据 + Gate 7 report.md 支持

### 🔧 维护

- 新增 2 个 bats 测试覆盖模板同步和升级脚本

---

## [1.4.0] - 2026-03-15

> 门禁体系大升级 + 品牌重塑 + 自动化测试全覆盖

### ✨ 新功能

- **正式更名 ClawKing 🦞**：独立品牌，不再叫 openclaw-starter
- **19 层质量门禁可移植**：门禁脚本不依赖特定机器，任何 ClawKing 安装都能用
- **Gate 6 E2E 感知**：自动检测是否有 Playwright 测试覆盖
- **Gate 7 截图去重**：阻止相同截图重复提交
- **12 项行为测试 (bats)**：门禁行为在沙盒 git 仓库中真实执行验证
- **ACP 认证引导**：安装时自动检查 ACP 配置，新手不会漏配
- **基建审计工具**：`infra-audit.sh` 一键检查系统健康
- **Gateway 自保护**：防止误操作导致 Gateway 意外停止，内建看门狗自动恢复
- **更新日志自动生成**：commit 后自动同步到 CHANGELOG
- **CI 自动化**：GitHub Actions 持续集成，提交自动跑检查
- **可选 CLI 工具安装**：himalaya、gog、bird、blogwatcher 按需装

### 🐛 修复

- Oracle 审计：修复 3 个 Critical + 2 个 Medium 门禁漏洞
- Guardian 守护进程更稳定，僵尸进程自动清理
- 测试套件全部修复通过（15 项）
- 同步脚本权限修复 + 私有引用清理
- CI 测试 shellcheck 兼容 + git init 分支名修复
- changelog 自动生成改 commit-msg hook，消除 amend 反模式

### 📖 文档

- README 全面重写，面向普通用户，讲人话
- 12 篇工具实战指南：从零开始手把手教你用每个工具
- 三道防线说明：自愈 → Claude 急救 → GitHub 备份
- 最佳模型搭配推荐
- AGENTS.md 自动教训沉淀

### 🔧 维护

- 3 个行为测试覆盖截图验证门禁

---

## [1.3.1] - 2026-03-11

> 首次公开发布，全面清理 + Node v25 升级

### ✨ 新功能

- **一键升级监控面板**：`--update-dashboard` 自动备份、下载、重建、重启
- **代码质量检查**：提交时自动检查语法和格式
- 监控面板和控制台截图加入文档

### 🐛 修复

- Node.js 升级到 v25，性能和兼容性更好
- 监控面板原生模块兼容 M 系列芯片
- 精简默认显示模块，界面更清爽

### 🔒 安全

- 清理所有私有信息，代码库可以安全公开使用
- 技能包脱敏，移除内部引用
- 添加 MIT 开源协议

---

## [1.3.1-rc] - 2026-03-11

> 新功能预览：语音、图片、更多兼容性

### ✨ 新功能

- **语音转文字**：发语音消息自动转文字，完全本地运行
- **图片理解能力**：自动配置 MiniMax 视觉模型
- **搜索能力**：安装时引导配置 Brave Search API
- **飞书优化**：消除偶尔弹出的配对确认窗

### 🐛 修复

- Intel Mac 全面兼容（路径、编译、配置都适配了）
- Guardian 守护默认自动重启
- Tailscale 三重启动保障
- macOS SSH 兼容 Ventura 及更新系统
- 监控面板登录 token 不再被意外覆盖
- 控制台自动生成登录链接

---

## [1.3.0] - 2026-03-10

> 安全大版本：9 项专业安全审查全部通过

### 🔒 安全

- 敏感信息保护：Token 和密码文件写入时自动加密权限
- 卸载安全检查：防止误删重要目录
- 仅本机访问：监控面板和 MCP 不再暴露到局域网
- 移除硬编码密钥：改为安装时手动输入
- Guardian 安全加固：防注入保护

### ✨ 新功能

- Guardian 智能守护：三层自动恢复
- 监控面板可配置：自定义显示哪些工具和模块
- 定时任务自动注册：安装完自动配好 13 个定时任务
- 健康检查脚本：一键检查所有后台服务状态
- 完整卸载：`--uninstall` 一键清理

### 🐛 修复

- 安装完自动打开浏览器
- 端口冲突预检
- 重跑安装不丢失已有 token
- 记忆搜索工具路径迁移到用户目录

---

## [1.2.0] - 2026-03-09

> 远程控制 + 7×24 小时在线

### ✨ 新功能

- 自动检测代理：国内用户安装时自动配置网络代理
- Tailscale 远程控制：不在家也能管理你的 Mac
- 防休眠：Mac 永不休眠，7×24 在线
- SSH 远程访问：自动开启

### 🐛 修复

- 安装过程只需输入一次密码
- 代理配好后自动验证连通性
- 单步失败不中断整体安装
- 私有仓库下载认证修复

---

## [1.1.0] - 2026-03-09

> 零配置，装完就能用

### ✨ 新功能

- MiniMax 模型内置：不需要配任何 AI API Key
- 监控面板自动安装

### 改进

- 安装步骤从 3 步简化到 2 步
- 模型选择更清晰

---

## [1.0.0] - 2026-03-09

> 🦞 首次发布

- The Loop 工作流：AI 协作方法论
- 24 个技能包：写作、编程、研究、运维
- 13 个定时任务模板
- 交互式安装
- 监控面板
- 7 个后台服务模板
