<!-- 用途: 所有支持频道的配置总览和导航 | 适用: 用户/Agent -->

# 频道配置总览

> OpenClaw 支持 8+ 聊天频道。选一个你最常用的，10 分钟连上。

## 频道一览

| 频道 | 功能丰富度 | 移动端 | 配置难度 | 推荐场景 |
|------|-----------|--------|---------|---------|
| **Discord** | ⭐⭐⭐⭐⭐ | ✅ | 中等 | 主力使用，功能最全 |
| **Telegram** | ⭐⭐⭐⭐ | ✅ | 简单 | 移动端为主、快速交互 |
| **Slack** | ⭐⭐⭐⭐ | ✅ | 中等 | 团队/工作场景 |
| **WhatsApp** | ⭐⭐⭐ | ✅ | 简单 | 日常聊天式交互 |
| **Signal** | ⭐⭐⭐ | ✅ | 简单 | 隐私优先 |
| **飞书** | ⭐⭐⭐ | ✅ | 中等 | 中国企业用户 |
| **iMessage** | ⭐⭐ | ✅ | 复杂 | Apple 生态 |
| **LINE** | ⭐⭐⭐ | ✅ | 中等 | 日本/东南亚用户 |

> 💡 **不知道选哪个？** Discord 功能最全（线程、按钮、投票、编码代理），推荐作为主力频道。移动端为主选 Telegram。

## 通用配置流程

所有频道的配置步骤大致相同：

1. **在目标平台创建 Bot / 应用**
2. **获取 Token / 凭据**
3. **通过 `openclaw config.patch` 写入配置**
4. **验证连接**

```bash
# 配置变更的标准方式
openclaw gateway config.patch '{
  "plugins": {
    "entries": {
      "频道名": {
        "enabled": true,
        "config": {
          // 频道特定配置
        }
      }
    }
  }
}'

# 验证状态
openclaw status
```

> ⚠️ **不要直接编辑 `openclaw.json`**，用 `config.patch` 保证配置合并正确。

---

## Discord

功能最全的频道，支持私聊、群聊、线程、按钮、投票、内嵌组件。

👉 **完整指南**：[Discord 配置指南](discord.md)

**快速要点**：
- 需要在 [Discord Developer Portal](https://discord.com/developers/applications) 创建 Bot
- 开启 **Message Content Intent**
- 支持 `allowlist`（按 guild 控制哪些服务器可用）
- 支持线程中启动 coding agent

**配置结构**：
```json5
{
  "plugins": {
    "entries": {
      "discord": {
        "enabled": true,
        "config": {
          "token": "__YOUR_DISCORD_BOT_TOKEN__",
          "allowlist": {
            "guilds": ["__YOUR_GUILD_ID__"]
          }
        }
      }
    }
  }
}
```

---

## Telegram

轻量级、移动端友好，配置最简单。

**准备工作**：
- 通过 [@BotFather](https://t.me/botfather) 创建 Bot 并获取 Token

**配置步骤**：

1. 在 Telegram 搜索 `@BotFather`，发送 `/newbot`
2. 按提示设置名字，获取 Bot Token
3. 写入配置：

```json5
{
  "plugins": {
    "entries": {
      "telegram": {
        "enabled": true,
        "config": {
          "token": "__YOUR_TELEGRAM_BOT_TOKEN__"
        }
      }
    }
  }
}
```

**特色功能**：
- 支持私聊和群组
- 支持 inline 按钮
- 消息长度限制 4096 字符（超长自动分段）
- 支持 Markdown 格式

**注意事项**：
- 群组中需要 `/start` 或 @mention 触发
- Bot 需要在群组中有读取消息权限

---

## Slack

适合团队协作场景，支持 Socket Mode（无需公网暴露）。

**准备工作**：
- 创建 [Slack App](https://api.slack.com/apps)
- 开启 Socket Mode

**配置步骤**：

1. 在 Slack API 页面创建 App
2. 开启 **Socket Mode**，获取 App-Level Token（`xapp-` 开头）
3. 在 **OAuth & Permissions** 添加 Bot Token Scopes：
   - `chat:write`
   - `channels:history`
   - `groups:history`
   - `im:history`
   - `app_mentions:read`
4. 安装 App 到 Workspace，获取 Bot User OAuth Token（`xoxb-` 开头）
5. 在 **Event Subscriptions** 订阅：
   - `message.channels`
   - `message.groups`
   - `message.im`
   - `app_mention`

```json5
{
  "plugins": {
    "entries": {
      "slack": {
        "enabled": true,
        "config": {
          "botToken": "__YOUR_SLACK_BOT_TOKEN__",
          "appToken": "__YOUR_SLACK_APP_TOKEN__",
          "groupPolicy": "open"
        }
      }
    }
  }
}
```

**注意事项**：
- `groupPolicy: "open"` 允许在任何频道响应，`"mention"` 只响应 @mention
- Socket Mode 不需要公网 URL，适合本地部署

---

## WhatsApp

通过 WhatsApp Business API 连接。

**准备工作**：
- [Meta for Developers](https://developers.facebook.com/) 账号
- WhatsApp Business API 访问权限

**配置步骤**：

1. 在 Meta Developer Portal 创建 App
2. 添加 WhatsApp Business 产品
3. 获取 Phone Number ID 和 Access Token
4. 设置 Webhook URL（需要公网可达的地址）

```json5
{
  "plugins": {
    "entries": {
      "whatsapp": {
        "enabled": true,
        "config": {
          "accessToken": "__YOUR_WHATSAPP_TOKEN__",
          "phoneNumberId": "__YOUR_PHONE_NUMBER_ID__",
          "verifyToken": "__YOUR_VERIFY_TOKEN__",
          "webhookPath": "/webhook/whatsapp"
        }
      }
    }
  }
}
```

**注意事项**：
- 需要公网可达的 Webhook URL（可用 Tailscale Funnel 或 ngrok）
- 24 小时会话窗口限制
- 消息格式限制较多（不支持 Markdown）

---

## Signal

端到端加密，隐私优先。

**准备工作**：
- 一个专用的 Signal 手机号（不要用你的主号）
- [signal-cli](https://github.com/AsamK/signal-cli) 或 signald

**配置步骤**：

1. 安装 signal-cli
2. 注册或关联号码
3. 配置 OpenClaw：

```json5
{
  "plugins": {
    "entries": {
      "signal": {
        "enabled": true,
        "config": {
          "number": "__YOUR_SIGNAL_NUMBER__"
        }
      }
    }
  }
}
```

**注意事项**：
- signal-cli 需要 Java 运行时
- 关联设备需要先在手机端确认
- 功能相对基础（不支持 inline 按钮等）

---

## 飞书

适合国内企业用户，支持机器人和群组。

**准备工作**：
- [飞书开放平台](https://open.feishu.cn/) 账号
- 创建企业自建应用

**配置步骤**：

1. 创建自建应用，获取 App ID 和 App Secret
2. 添加「机器人」能力
3. 在事件订阅中添加请求地址（Webhook URL 或使用长连接模式）
4. 订阅消息事件：`im.message.receive_v1`

```json5
{
  "plugins": {
    "entries": {
      "feishu": {
        "enabled": true,
        "config": {
          "appId": "__YOUR_FEISHU_APP_ID__",
          "appSecret": "__YOUR_FEISHU_APP_SECRET__"
        }
      }
    }
  }
}
```

**注意事项**：
- 建议开启 `groupPolicy: "open"` 避免群组中的确认弹窗
- 支持富文本和卡片消息

---

## iMessage

Apple 生态内使用，配置较复杂。

**准备工作**：
- macOS 设备（iMessage 只能在 macOS 上运行）
- Messages.app 已登录

**注意事项**：
- 需要 AppleScript 或 Shortcuts 集成
- 需要授予终端/应用 Accessibility 权限
- 功能受限，推荐作为补充而非主力频道
- 具体配置参考 OpenClaw 官方文档

---

## LINE

适合日本和东南亚用户。

**准备工作**：
- [LINE Developers](https://developers.line.biz/) 账号
- 创建 Messaging API Channel

**配置步骤**：

1. 在 LINE Developers Console 创建 Provider 和 Channel
2. 获取 Channel Access Token（Long-lived）
3. 设置 Webhook URL

```json5
{
  "plugins": {
    "entries": {
      "line": {
        "enabled": true,
        "config": {
          "channelAccessToken": "__YOUR_LINE_CHANNEL_TOKEN__",
          "channelSecret": "__YOUR_LINE_CHANNEL_SECRET__"
        }
      }
    }
  }
}
```

---

## 多频道并行

可以同时启用多个频道。AI 会自动识别消息来源并路由到正确的频道回复。

```json5
{
  "plugins": {
    "entries": {
      "discord": { "enabled": true, "config": { /* ... */ } },
      "telegram": { "enabled": true, "config": { /* ... */ } },
      "slack": { "enabled": true, "config": { /* ... */ } }
    }
  }
}
```

跨频道消息：AI 可以通过 `message` 工具主动向任意已配置的频道发消息。

## 常见问题

**Q: 连接后收不到消息？**
A: 检查 `openclaw status` 确认 Gateway 在运行。检查对应频道的 Token 是否正确。查看日志 `~/.openclaw/logs/err.log`。

**Q: 需要公网地址怎么办？**
A: 使用 [Tailscale Funnel](https://tailscale.com/funnel)（推荐）或 ngrok。Discord 和 Slack（Socket Mode）不需要公网地址。

**Q: 一个频道能连多个群？**
A: 可以。用 `allowlist` 控制哪些群/服务器可以触发 AI。

---

> 相关文档：[Discord 详细指南](discord.md) · [配置指南](../SETUP-GUIDE.md) · [排错指南](../TROUBLESHOOTING.md)
