<!-- 用途: Day 2 日常运维操作手册 | 适用: 用户/Agent -->

# 日常运维指南

> 装好用起来了，日常怎么维护？日志在哪看、怎么备份、怎么清理、怎么监控。

## 服务管理

### 查看状态

```bash
openclaw status
```

输出会显示 Gateway 运行状态、已连接的频道、活跃 session 数等。

### 启动 / 停止

ClawKing 使用 macOS LaunchAgent 管理服务：

```bash
# 查看 LaunchAgent 状态
launchctl list | grep openclaw

# 手动启动（通常不需要，开机自动启动）
launchctl kickstart -k gui/$(id -u)/ai.openclaw.gateway

# 停止（⚠️ 谨慎操作，会断开所有频道）
launchctl bootout gui/$(id -u)/ai.openclaw.gateway
```

> ⚠️ **不要用 `openclaw gateway restart`**。已知 SIGUSR1 bug 可能导致服务挂起。安全重启方式是 `kill` + `kickstart`。

### 配置变更

```bash
# 标准方式：用 config.patch
openclaw gateway config.patch '{ "your": "changes" }'

# 验证配置（任何重启前必须做）
openclaw config validate

# 查看当前配置
openclaw config show
```

> **不要直接编辑 `openclaw.json`**。用 `config.patch` 确保配置合并正确。

## 日志

### 日志位置

| 日志 | 路径 | 内容 |
|------|------|------|
| 错误日志 | `~/.openclaw/logs/err.log` | Gateway 错误、插件异常 |
| 访问日志 | `~/.openclaw/logs/access.log` | API 请求记录 |
| Guardian 日志 | `~/.openclaw/logs/guardian.log` | 健康监控恢复记录 |

### 常用排查命令

```bash
# 查看最近的错误
tail -50 ~/.openclaw/logs/err.log

# 实时跟踪错误
tail -f ~/.openclaw/logs/err.log

# 搜索特定错误
grep -i "error\|fail\|crash" ~/.openclaw/logs/err.log | tail -20

# 查看特定频道的日志
grep "discord\|telegram" ~/.openclaw/logs/err.log | tail -20

# 查看 Cron 执行记录
grep "cron" ~/.openclaw/logs/err.log | tail -20
```

### 日志轮转

日志会持续增长，定期清理：

```bash
# 查看日志大小
du -sh ~/.openclaw/logs/

# 手动轮转（保留最近的，归档旧的）
cd ~/.openclaw/logs/
cp err.log "err.log.$(date +%Y%m%d)"
> err.log
```

> 💡 建议配置 Cron 自动轮转，或使用 macOS 的 `newsyslog`。

## 备份

### 需要备份什么

| 内容 | 路径 | 重要性 |
|------|------|--------|
| Workspace 文件 | `~/clawd/` | ⭐⭐⭐ 最重要 |
| OpenClaw 配置 | `~/.openclaw/config.json` | ⭐⭐⭐ |
| 记忆数据 | `~/clawd/memory/` | ⭐⭐ |
| Session 数据 | `~/.openclaw/sessions/` | ⭐ 可选 |

### Git 备份（推荐）

最简单的备份方式——把 `~/clawd/` 当 Git 仓库管理：

```bash
cd ~/clawd
git init  # 如果还没初始化
git add -A
git commit -m "backup $(date +%Y-%m-%d)"
git remote add origin <your-private-repo-url>
git push
```

设置自动备份（每小时）：

```bash
# 在 Cron 中添加备份任务，或用 launchd 定时执行
# 示例 cron 表达式（每小时整点）：
# 0 * * * * cd ~/clawd && git add -A && git commit -m "auto-backup" && git push
```

### 云存储备份

可以配置 Cloudflare R2、AWS S3 或其他对象存储作为额外备份层：

```bash
# 使用 rclone（通用云存储工具）
brew install rclone
rclone config  # 配置你的云存储
rclone sync ~/clawd/ remote:your-bucket/clawd-backup/
```

### 恢复

```bash
# 从 Git 恢复
git clone <your-private-repo-url> ~/clawd

# 恢复 OpenClaw 配置
cp backup/config.json ~/.openclaw/config.json
openclaw config validate
```

## 存储清理

### Session 清理

长期运行会积累大量 session 数据：

```bash
# 查看 session 存储大小
du -sh ~/.openclaw/sessions/

# 查看活跃 session 数
ls ~/.openclaw/sessions/ | wc -l

# 清理过期 session（OpenClaw 内置命令）
openclaw sessions prune
```

### 记忆清理

```bash
# 查看记忆目录大小
du -sh ~/clawd/memory/

# 归档旧日记（30 天前）
mkdir -p ~/clawd/memory/journal/archive
find ~/clawd/memory/journal/ -maxdepth 1 -name "*.md" -mtime +30 \
  -exec mv {} ~/clawd/memory/journal/archive/ \;

# 重建语义搜索索引
qmd rebuild
```

### 日志清理

```bash
# 清理 30 天前的归档日志
find ~/.openclaw/logs/ -name "*.log.*" -mtime +30 -delete
```

## 监控

### Dashboard

内置监控面板，浏览器访问：

```
http://localhost:3001
```

Dashboard 显示：
- Gateway 运行状态
- 活跃 session 数
- Cron 任务状态
- 系统资源使用

### Guardian

Guardian 是自动恢复服务，检测到 Gateway 挂掉后自动重启：

```bash
# 查看 Guardian 状态
launchctl list | grep guardian

# 查看 Guardian 日志
tail -20 ~/.openclaw/logs/guardian.log
```

Guardian 恢复链路：L1（进程检查）→ L1.5（端口检查）→ L3（深度检查）→ L4（完全重建）。

### 健康检查脚本

快速检查一切是否正常：

```bash
# 一行健康检查
openclaw status && curl -s localhost:3001 > /dev/null && echo "✅ All good" || echo "❌ Something wrong"
```

## Cron 任务管理

```bash
# 查看所有 Cron 任务
openclaw cron list

# 查看失败的任务
openclaw cron list | grep -i "error\|fail"

# 手动触发某个任务
openclaw cron trigger <job-name>

# 禁用/启用任务
openclaw cron disable <job-name>
openclaw cron enable <job-name>
```

> 详细的 Cron 管理见 [Cron Fleet 指南](CRON-FLEET.md)。

## 升级

```bash
# 查看当前版本
openclaw --version

# 升级 ClawKing（使用安全升级脚本）
bash ~/clawd/scripts/safe-upgrade-openclaw.sh

# 升级后验证
openclaw status
openclaw config validate
```

> ⚠️ **不要用裸 `npm install -g openclaw`**。升级脚本会处理停服、备份、验证等步骤。

## 常见运维场景

### 场景：AI 不回消息了

```bash
# 1. 检查 Gateway
openclaw status

# 2. 看错误日志
tail -20 ~/.openclaw/logs/err.log

# 3. 检查频道连接
# 日志中搜索频道名
grep "discord\|telegram" ~/.openclaw/logs/err.log | tail -5

# 4. 如果需要重启
openclaw config validate  # 先验证
# 然后用安全重启
```

### 场景：磁盘快满了

```bash
# 找大文件
du -sh ~/.openclaw/*/ | sort -rh | head -10

# 清理 session + 日志
openclaw sessions prune
find ~/.openclaw/logs/ -name "*.log.*" -mtime +7 -delete
```

### 场景：Cron 任务失败

```bash
# 查看失败详情
openclaw cron list
tail -50 ~/.openclaw/logs/err.log | grep cron

# 重新触发
openclaw cron trigger <job-name>
```

---

> 相关文档：[排错指南](TROUBLESHOOTING.md) · [Cron Fleet 指南](CRON-FLEET.md) · [配置指南](SETUP-GUIDE.md)
