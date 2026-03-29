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
- **Push 阶段**（pre-push）— 全链路验证：安全扫描、TDD、类型检查、截图验收、生产验证、浏览器自动化

---

## 完整门禁列表

### Commit 阶段（prepare-commit-msg + commit-msg）

| Gate | 名称 | 做什么 | 阻断/警告 |
|------|------|--------|----------|
| **0** | Prompt CHANGELOG | 改了 `.prompt.md` 必须同时更新 `prompts/CHANGELOG.md` | ⛔ 阻断 |
| **0.4** | Secrets Scan | 扫描 staged 文件中的 API Key / Token / 密码模式（支持 `.secretsignore` 白名单） | ⛔ 阻断 |
| **0.5** | Scope Lock | staged 文件 > 5 个时列出文件清单，需 `[scope-ack]` 确认。防 `git add -A` 混入无关文件 | ⛔ 阻断（Workspace 模式降级为 ⚠️） |
| **0.6** | 路径黑名单 | 阻止 backup/journal 等非业务路径进入 commit | ⛔ 阻断 |
| **0.7** | Spec 引用 | `feat`/`fix`/`refactor` commit 涉及 ≥2 个代码文件，必须引用 approved spec (`[spec:slug]`) | ⛔ 阻断（有 tasks/ 目录的项目） |
| **REVIEWED** | 自测确认 | 代码/配置变更需要 `REVIEWED=1 git commit` 确认已自测 | ⛔ 阻断（Workspace 模式跳过） |
| **S2a** | UI 意图声明 | Spec 交付时必须声明 `[UI]`/`[NO_UI]`/`[NO_UI_LOGIC]`，Gate 7 子检查依赖此标记 | ⛔ 阻断 |
| **Shell** | ShellCheck | `.sh` 文件自动 `shellcheck -S warning` | ⛔ 阻断 |
| **JSON** | JSON 语法 | `python3 -m json.tool` 验证 | ⛔ 阻断 |
| **YAML** | YAML 语法 | `yaml.safe_load` 验证 | ⛔ 阻断 |
| **签章** | Tree-hash | 自动生成 `Pre-commit-gate: <tree-hash>` trailer，防止绕过 hook | 自动写入 |
| **P-gates** | 项目特有 | `.githooks/project-gates.sh` 中定义的项目级检查 | 视规则而定 |

> **CHANGELOG 自动更新**：commit-msg hook 自动把 commit message 追加到 CHANGELOG.md 的 `[开发中]` 段，不需要手动维护。

### Push 阶段（pre-push）

| Gate | 名称 | 做什么 | 阻断/警告 |
|------|------|--------|----------|
| **0.4** | Secrets Scan (二次) | push 级别再扫一遍——防止 `--no-verify` commit 漏网 | ⛔ 阻断 |
| **1** | Conventional Commits | 验证每个 commit 格式：`type[(scope)]: description` | ⛔ 阻断 |
| **2** | 反切片 (Anti-salami) | 累计 ≥8 个代码文件变更但没有 spec 引用 → 阻断。防大变更拆小 commit 绕过 | ⛔ 阻断 |
| **2.1** | Spec 完整性 | 验证引用的 spec 文件存在且不是 abandoned | ⚠️ 警告 |
| **2.5** | 教训回写 | fix/revert commit 检查是否同时更新了 AGENTS.md 或 lessons.md | ⚠️ 警告 |
| **3** | Tree-hash 校验 | 对比 trailer 和实际 tree hash，不匹配 = hook 被绕过或篡改 | ⛔ 阻断 |
| **4** | TDD | 有代码变更必须有测试变更（检测整个 push 范围，跨 commit 累加） | ⛔ 阻断（无测试框架时 ⚠️） |
| **5** | 类型/Lint | TypeScript → `tsc --noEmit`；JS → `eslint`（30s 超时） | ⛔ 阻断 |
| **6** | 单元测试 | 运行 `npm test` / 对应测试框架 | ✅ 声明通过 |
| **7** | **截图验收**（含子检查） | Spec 标记 delivered 时验证验收证据——详见下方 | ⛔ 阻断 |
| **8** | 生产验证 | 部署文件变更时自动 HTTP 健康检查（15s 超时） | ⛔ 阻断（Workspace ⚠️） |
| **9** | 浏览器自动验证 | UI 文件变更时自动 CDP 截图 + console 检查 | ⛔ 阻断 |

---

## Gate 7 截图验收——子检查详解

Gate 7 是最复杂的门禁，包含多层子检查，确保 AI 不能用假截图/重复截图糊弄过关：

```
Spec delivered？
  ├── 无 [UI]/[NO_UI]/[NO_UI_LOGIC] 声明 → S2a 阻断
  ├── [NO_UI] → 跳过截图检查 ✅
  ├── [NO_UI_LOGIC] → 跳过截图检查 ✅
  └── [UI] → 进入子检查链：
        ├── 有 showboat report.md？→ 命令级验收 ✅
        ├── docs/acceptance/<slug>/ 有截图？
        │     ├── 7a: 伪造检测（<5KB = 假截图）
        │     ├── 7f: 纯色/空白检测（ImageMagick stddev）
        │     ├── 7e: 命名规范（<slug>-<N>-<desc>.png）⚠️
        │     ├── 7b: SHA 去重（相同文件不同名）
        │     ├── 7c: 视觉相似度（RMSE 检测同页面不同时间截图）
        │     ├── 7d: 动态计数（截图 + CDP ≥ [UI] 标签数）
        │     ├── Cross: UI 意图交叉验证（[NO_UI] vs 实际视图文件变更）
        │     └── R1: review.jsonl 审查记录（verdict=fix 必须有 fix_commit）
        └── 无截图无 report → ⛔ 阻断
```

| 子检查 | 做什么 | 阻断/警告 |
|--------|--------|----------|
| **7a** | 截图 < 5KB = 伪造（`touch` 生成的空文件或 1px PNG） | ⛔ 阻断 |
| **7b** | SHA256 去重——相同内容不同文件名不算多张截图 | ⚠️ 警告（影响 7d 计数） |
| **7c** | RMSE 视觉相似度——同一页面截两次不算独立验证 | ⚠️ 警告 |
| **7d** | 动态计数：有效截图 + CDP 场景 ≥ spec 中 `[UI]` 标签数 | ⛔ 阻断 |
| **7e** | 截图命名规范 `<slug>-<N>-<desc>.png` | ⚠️ 警告（渐进推广） |
| **7f** | 小尺寸（<100px）或纯色检测（stddev 过低 = 空白页） | ⛔ 阻断 |
| **Cross** | `[NO_UI]` 声明但 diff 有视图文件变更 → 矛盾 | ⛔ 阻断 |
| **R1** | `review.jsonl` 审查：每张截图必须有 verdict（pass/fix/known） | ⛔ 阻断 |

> **为什么这么严格？** AI Agent 最擅长的就是「看起来完成了」——跑个测试截个白屏就说 OK。Gate 7 的设计目标是让 AI 无法作弊。

---

## 两种模式

- **Strict 模式**（默认）— 门禁阻断不合规的操作
- **Workspace 模式** — 项目根有 `SOUL.md` 或 `HEARTBEAT.md`：scope-lock/REVIEWED 降级为警告，Gate 2/3 跳过（适合文档/配置类仓库）

---

## 项目特有门禁

每个项目可以在 `.githooks/project-gates.sh` 中添加自己的检查。ClawKing 自带的：

| Gate | 名称 | 做什么 |
|------|------|--------|
| **P2** | 隐私保护 | 扫描个人路径、姓名等隐私信息——ClawKing 是开源项目，不允许泄露 |

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

# 2. 在 worktree 中执行任务
SPAWN_TOKEN=xxx WORKTREE_DIR=/tmp/kc-<slug> \
  bash scripts/codex-dispatch.sh <dir> <mode>

# 3. 完成后合并回主分支
bash scripts/merge-worktree.sh /tmp/kc-<slug>
# → rebase → 跑门禁 → flock 短锁 merge+push → 清理
```

---

## Spec-Driven 任务流

门禁与 Spec 任务系统深度集成：

```
draft → Oracle 审查 → approved → in_progress → delivered → done
```

- commit 引用 `[spec:slug]` 后，spec 自动从 approved → in_progress
- commit message 含 "deliver" 关键词时，自动 → delivered
- 交付时 Gate 7 全套子检查激活，验证截图/report 证据

---

## 辅助工具

### git-push-safe.sh — TDD 自动补救

Gate 4 TDD 拦截 push 时，这个脚本自动生成测试：

```bash
bash scripts/git-push-safe.sh
```

1. 尝试正常 push → 被 TDD 拦截
2. 自动检测缺少测试的文件
3. 调 Codex 生成测试 → Claude Code fallback → 脚手架兜底
4. 自动 commit 测试 → 重新 push

### gate-telemetry.sh — 门禁统计

每个 gate pass/block 时上报到 `~/.openclaw/logs/gate-events.jsonl`，infra-dashboard 门禁页面展示统计。Fire-and-forget，不影响门禁本身。

---

## 安装

```bash
# 当前仓库
bash workspace/scripts/setup-gates.sh

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

⚠️ 跳过 commit hook 后 push 时会被 Gate 3（tree-hash）拦截。确需跳过时 commit 和 push 都要加 `--no-verify`。

### 常见拦截和解法

| 报错 | 解法 |
|------|------|
| `缺 REVIEWED=1` | `REVIEWED=1 git commit -m "..."` |
| `staged files > 5 but no [scope-ack]` | 确认文件列表，message 加 `[scope-ack]` |
| `Bad commit format` | `git commit --amend` 改为 `type(scope): description` |
| `TDD gate — no test changes` | `bash scripts/git-push-safe.sh` 自动补测试 |
| `Typecheck failed` | `npx tsc --noEmit` 修复类型错误 |
| `Tree-hash mismatch` | `git commit --amend --no-edit` 重新签章 |
| `no spec reference` | 先写 spec（`tasks/` 下），走审批再提交 |
| `Gate 7 — no evidence` | 在 `docs/acceptance/<slug>/` 放截图或 `showboat report` |
| `Gate 7a — 伪造截图` | 用真实浏览器截图，不要 `touch` 空文件 |
| `Gate 7d — 截图不够` | 每个 spec 中的 `[UI]` 标签对应一张截图 |
| `R1 — review.jsonl` | 每张截图写审查记录 `{"file":"x.png","verdict":"pass"}` |
| `Gate 9 — browser failed` | 检查 Chrome 实例和 `cdp-verify.mjs` 是否可用 |

### 支持哪些测试框架？

Gate 4 自动检测：**Vitest** · **Jest** · **pytest** · **Go test** · **Cargo test** · **Bats**

### 门禁和 CI 什么关系？

门禁全部在本地执行，不依赖 CI。本地 hook = 唯一物理防线。`hooks-audit.yml`（GitHub Actions）是异步检测层，审计是否有人用 `--no-verify` 绕过了本地 hook。

---

## 自定义门禁

在项目根目录创建 `.githooks/project-gates.sh`：

```bash
#!/usr/bin/env bash
# Available: $COMMIT_MSG_FILE, $COMMIT_MSG_LINE, $STAGED_FILES, $STAGED_COUNT

# 示例：禁止直接修改 dist/
for f in $STAGED_FILES; do
  case "$f" in
    dist/*) echo "⛔ 不要直接改 dist/"; exit 1 ;;
  esac
done
```
