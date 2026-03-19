<!-- 用途: Gemini CLI 作为 coding agent 的使用指南 | 适用: 用户/Agent -->

# Gemini CLI — Google 编码代理

> ⚠️ 本篇讲 Gemini CLI 作为 **coding agent** 的用法。如果你要找 Oracle 审查工具（底层恰好使用 Gemini），请看 [Oracle 指南](oracle.md)。

## 为什么用它

Gemini CLI 是 Google 出品的编码代理。和 Codex、Claude Code 一样，你用自然语言描述任务，它帮你写代码。

Gemini 的独特优势：
- **超长上下文**（100 万+ token）——可以一次性读大型代码库
- **多模态**——能看图片、分析截图、理解 UI
- **Google OAuth 登录**——免费额度足够日常使用
- **速度快**——Flash 模型响应极快

和 Codex / Claude Code 的分工：

| 场景 | 推荐 |
|------|------|
| 日常编码、快速修改 | Codex / Claude Code |
| 大型代码库理解 | **Gemini**（上下文长） |
| 多模态任务（看图 → 写码） | **Gemini** |
| 审查 / 二次确认 | **Gemini**（作为第二视角） |

---

## 你需要准备什么

📋 清单：
- [Google 账号](https://accounts.google.com)
- Node.js 22+
- OpenClaw 已安装

---

## 快速开始

### 第一步：安装 Gemini CLI

```bash
npm install -g @google/gemini-cli
```

> 如果安装报权限错误，参考 [排错指南](../TROUBLESHOOTING.md#npm-权限)。

### 第二步：首次登录

```bash
gemini
```

首次运行会弹出浏览器，用 Google 账号登录授权。登录一次后自动记住。

看到交互式界面就成功了：

```
Welcome to Gemini CLI!
>
```

按 `Ctrl+C` 退出。

### 第三步：测试一下

```bash
# 在任意项目目录下
cd ~/your-project
gemini
> 分析这个项目的架构，给出改进建议
```

Gemini 会自动读取项目文件，给出分析。

---

## 核心用法

### 在 OpenClaw 中使用

AI 会在需要时自动调度 Gemini CLI。你也可以主动要求：

> "用 Gemini 帮我分析一下这个项目的架构"
> "让 Gemini 看一下这张截图，告诉我 UI 有什么问题"

### 手动调用

```bash
# 交互模式
gemini

# 一次性执行（适合脚本）
echo "分析 src/ 目录的代码质量" | gemini

# 指定模型
gemini --model gemini-2.5-pro

# 指定文件上下文
gemini --file src/main.ts --file README.md
```

### 多模态用法

```bash
# 分析截图
gemini --file screenshot.png "这个 UI 有什么可以改进的？"

# 从设计稿生成代码
gemini --file design.png "根据这个设计稿，用 React + Tailwind 实现"
```

---

## 进阶配置

### 在 OpenClaw 中注册为 Coding Agent

如果 setup.sh 已经配好了，可以跳过。手动配置：

编辑 `~/clawd/TOOLS.md`，在 CLI 工具表里加一行：

```markdown
| Gemini CLI | gemini | 多模态/长上下文编码 |
```

### 模型选择

| 模型 | 特点 |
|------|------|
| `gemini-2.5-pro` | 默认，平衡速度和质量 |
| `gemini-2.5-flash` | 更快，适合简单任务 |

### 上下文管理

Gemini 的上下文窗口很大，但加载太多文件会拖慢速度。建议：

- 大项目只加载相关目录：`gemini --file src/core/`
- 用 `.geminiignore` 排除 `node_modules`、`.git` 等

---

## 常见问题

**Q: 登录失败 / 浏览器没弹出来？**
A: 确认网络能访问 Google 服务。如果在代理后面，确保代理不拦截 OAuth 回调。也可以用 `gemini --no-browser` 手动复制 URL。

**Q: 和 Oracle 什么关系？**
A: 完全独立。Oracle 是 ClawKing 的代码审查工具（碰巧底层调 Gemini API），本篇讲的是 Gemini CLI 本身作为 coding agent 的直接使用。

**Q: 免费额度够用吗？**
A: Google 给的免费额度覆盖大部分日常用法。超了会提示升级。

**Q: 可以和 Codex / Claude Code 同时用吗？**
A: 可以。OpenClaw 支持配置多个 coding agent，AI 会根据任务特点选择最合适的。

---

> 相关文档：[Codex 指南](codex.md) · [Claude Code 指南](claude-code.md) · [Oracle 指南](oracle.md)
