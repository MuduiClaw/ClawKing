# 门禁系统 — 让 AI 不能乱搞

> AI Agent 写代码很快，但「快」不等于「对」。
> 门禁系统在代码流转的关键节点自动检查，确保 AI 产出的东西能用。

---

## 工作原理

ClawKing 的门禁系统基于 Git Hooks——每次 `commit` 和 `push` 都会自动触发检查。不需要额外的 CI 服务，本地就能拦住问题。

```
你写代码 → git commit → prepare-commit-msg 检查 → commit 成功
                                    ↕
              commit-msg 自动更新 CHANGELOG
                                    ↓
            git push → pre-push 检查 → push 成功
```

两道防线：
- **Commit 阶段**（prepare-commit-msg）— 语法检查 + 格式规范 + 防伪签章
- **Push 阶段**（pre-push）— 全链路验证：类型检查、测试、lint、生产环境

---

## 门禁一览

### Commit 阶段（prepare-commit-msg + commit-msg）

在代码提交时执行，检查通过才能 commit：

| Gate | 名称 | 做什么 | 什么时候触发 |
|------|------|--------|-------------|
| **0** | Prompt CHANGELOG | 改了 `.prompt.md` 必须同时更新 `prompts/CHANGELOG.md` | 有 prompt 文件变更 |
| **0.5** | Scope Lock | staged 文件 > 5 个，commit message 需要加 `[scope-ack]` 确认。防止 `git add -A` 混入无关文件 | staged 文件数超阈值 |
| **0.7** | Spec 引用 | `feat`/`fix`/`refactor` commit 涉及 ≥2 个代码文件，必须引用 approved spec (`[spec:slug]`) | 有 tasks/ 目录的项目 |
| **REVIEWED** | 自测确认 | 代码/配置变更需要 `REVIEWED=1 git commit` 确认已自测 | 非 workspace 项目的代码变更 |
| **Shell** | ShellCheck | `.sh` 文件自动 shellcheck -S warning | 有 .sh 文件变更 |
| **JSON** | JSON 语法 | `python3 -m json.tool` 验证 | 有 .json 文件变更 |
| **YAML** | YAML 语法 | `yaml.safe_load` 验证 | 有 .yml/.yaml 文件变更 |
| **签章** | Tree-hash 签章 | 自动生成 `Pre-commit-gate: <tree-hash>` trailer，防止绕过 hook | 每次 commit |

> **CHANGELOG 自动更新**：commit-msg hook 自动把 commit message 追加到 CHANGELOG.md 的 `[开发中]` 段，不需要手动维护。

### Push 阶段（pre-push）

在代码推送时执行，检查通过才能 push：

| Gate | 名称 | 做什么 | 什么时候触发 |
|------|------|--------|-------------|
| **1** | Conventional Commits | 验证每个 commit 的格式：`type[(scope)]: description` | 每次 push |
| **2** | 反切片 (Anti-salami) | 累计 ≥8 个代码文件变更但没有 `[spec:slug]` 引用 → 阻断。防止大变更拆小 commit 绕过 spec 要求 | 有 tasks/ 目录的项目 |
| **2.1** | Spec 完整性 | 验证 spec 文件存在且状态不是 abandoned（警告） | 有 spec 引用时 |
| **3** | Tree-hash 校验 | 对比每个 commit 的 tree-hash trailer 和实际 tree hash，不匹配 = hook 被绕过或 commit 被篡改 | 非 workspace 项目 |
| **4** | TDD | 有代码变更必须有测试变更。检测整个 push 范围（commit A 改代码 + commit B 补测试 = OK） | 检测到测试框架 |
| **5** | 类型/Lint | TypeScript → `tsc --noEmit`；JavaScript → `eslint`。30s 超时 | 有 tsconfig.json 或 eslint config |
| **6** | E2E 感知 | 页面级文件（page.tsx/layout.tsx/App.tsx）变更需要 e2e 测试或 `[e2e-ack]` 确认 | 有 playwright.config.ts |
| **7** | 截图验收 | spec 标记 delivered 时，验证 `docs/acceptance/<slug>/` 有截图或 showboat report | spec 状态变更 |
| **8** | 生产验收 | 部署文件（next.config/Dockerfile/CI）变更自动触发 HTTP 健康检查 | 有部署文件变更 |

### 项目特有门禁（project-gates.sh）

每个项目可以在 `.githooks/project-gates.sh` 中添加自己的检查。ClawKing 自带的：

| Gate | 名称 | 做什么 |
|------|------|--------|
| **0.4** | Secrets Scan | 扫描 staged 文件中的 API Key / Token 模式 |
| **P2** | 隐私保护 | 阻止个人路径、姓名等隐私信息进入公开仓库 |

---

## 两种模式

- **Strict 模式**（默认）— 门禁阻断不合规的操作
- **Workspace 模式** — 项目根有 `SOUL.md` 或 `HEARTBEAT.md`：shellcheck/scope-lock 降级为**警告**（适合文档/配置类仓库）

Workspace 模式下，Gate 2（反切片）和 Gate 3（tree-hash）也会跳过——除非变更涉及 `.githooks/` 目录。

---

## Worktree 隔离工作流

ClawKing 使用 Git Worktree 隔离并发的 AI 编码任务，每个任务在独立的工作目录中执行：

```
主仓库 ~/projects/ClawKing (main)
  ├── /tmp/kc-auth-login/     ← Codex Agent A 在做登录
  ├── /tmp/kc-cron-fleet/     ← Codex Agent B 在做定时任务
  └── /tmp/kc-gates-fix/      ← Claude Code 在修门禁
```

**为什么用 worktree？**
- 每个 Agent 有独立的 staging area，互不干扰
- 不需要 lockfile——物理隔离比规则更可靠
- 合并时自动 rebase + 跑门禁 + flock 短锁，保证原子性

**操作流程**：

```bash
# 1. 创建 worktree（自动检查 repo + AGENTS.md + build）
bash scripts/spawn-worktree.sh <project-dir> --spec <slug>
# → 输出 WORKTREE_DIR=/tmp/kc-<slug> + SPAWN_TOKEN

# 2. 在 worktree 中执行任务
SPAWN_TOKEN=xxx WORKTREE_DIR=/tmp/kc-<slug> \
  bash scripts/codex-dispatch.sh <dir> <mode>

# 3. 完成后合并回主分支
bash scripts/merge-worktree.sh /tmp/kc-<slug>
# → 自动 rebase → 跑门禁 → flock 短锁 merge+push → 清理 worktree
```

> Worktree 隔离目前在 `.spec-atomic` 项目（如 ClawKing）中强制启用。其他项目使用 `.spec-atomic-warn` 观察模式——scope 问题只警告不阻断。

---

## Spec-Driven 任务流

门禁与 Spec 任务系统深度集成：

```
draft → Oracle 审查 → approved → in_progress → delivered → done
```

- commit 引用 `[spec:slug]` 后，spec 自动从 approved → in_progress
- commit message 含 "deliver" 关键词时，自动 → delivered
- 交付时 Gate 7 检查验收证据（截图或 showboat report）

---

## 辅助工具

### git-push-safe.sh — TDD 自动补救

TDD 门禁（Gate 4）拦截 push 时，这个脚本可以自动生成测试：

```bash
bash scripts/git-push-safe.sh
```

1. 尝试正常 push
2. 被 TDD 拦截 → 自动检测缺少测试的文件
3. 调 Codex 生成测试 → Claude Code fallback → 脚手架兜底
4. 自动 commit 测试 → 重新 push

### gate-telemetry.sh — 门禁统计

每个门禁 pass/block 时上报事件到 `~/.openclaw/logs/gate-events.jsonl`，infra-dashboard 的门禁页面读取这个文件展示统计。Telemetry 是 fire-and-forget——不影响门禁本身。

---

## 安装

```bash
# 当前仓库
bash workspace/scripts/setup-gates.sh

# 全局（所有 git 仓库）
bash workspace/scripts/setup-gates.sh --global

# 卸载
bash workspace/scripts/setup-gates.sh --uninstall
```

安装后所有 `git commit` 和 `git push` 自动触发门禁。

---

## FAQ

### 如何临时跳过门禁？

```bash
git commit --no-verify -m "emergency fix"
git push --no-verify
```

⚠️ 跳过 commit hook 后 push 时会被 Gate 3（tree-hash）拦截。如果确实需要跳过，commit 和 push 都要加 `--no-verify`。

### 常见拦截和解法

| 报错 | 解法 |
|------|------|
| `缺 REVIEWED=1` | `REVIEWED=1 git commit -m "..."` |
| `staged files > 5 but no [scope-ack]` | 确认文件列表，message 加 `[scope-ack]` |
| `Bad commit format` | `git commit --amend` 改为 `type(scope): description` |
| `TDD gate` | `bash scripts/git-push-safe.sh` 自动补测试 |
| `Typecheck failed` | `npx tsc --noEmit` 修复类型错误 |
| `Tree-hash mismatch` | `git commit --amend --no-edit` 重新签章 |
| `no spec reference` | 先写 spec（`tasks/` 下），走审批再提交 |

### 支持哪些测试框架？

Gate 4 自动检测：**Vitest** · **Jest** · **pytest** · **Go test** · **Cargo test** · **Bats**

### 门禁和 CI 什么关系？

ClawKing 的门禁全部在本地执行，不依赖 CI。本地 hook = 唯一物理防线。`hooks-audit.yml` 是异步检测层（GitHub Actions），用于审计是否有人绕过了本地 hook。

---

## 自定义门禁

在项目根目录创建 `.githooks/project-gates.sh`，会在全局门禁之后被 source：

```bash
#!/usr/bin/env bash
# Available vars: $COMMIT_MSG_FILE, $COMMIT_MSG_LINE, $STAGED_FILES, $STAGED_COUNT

# 示例：禁止直接修改 dist/
for f in $STAGED_FILES; do
  case "$f" in
    dist/*) 
      echo "⛔ 不要直接改 dist/ — 跑 npm run build"
      exit 1 ;;
  esac
done
```
