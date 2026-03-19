<!-- 用途: 从零创建自定义 Skill 的完整指南 | 适用: 用户/Agent -->

# 自定义 Skill 开发指南

> Skill 是 AI 的能力模块。写一个 SKILL.md，你的 AI 就多了一项技能。

## 什么是 Skill

Skill 是一个目录，包含 `SKILL.md`（行为指令）和可选的脚本/参考文档。AI 根据用户请求的描述自动匹配并加载对应 Skill。

```
my-skill/
├── SKILL.md           # 必须：AI 行为指令
├── references/        # 可选：参考文档（API docs、示例等）
├── scripts/           # 可选：执行脚本
└── templates/         # 可选：模板文件
```

**核心机制**：AI 扫描所有 Skill 的 `description` 字段，匹配用户意图后读取对应的 `SKILL.md` 执行。

## Skill 放哪

Skills 放在以下位置，自动被发现：

| 位置 | 用途 | 升级时覆盖？ |
|------|------|------------|
| `~/clawd/skills/` | Workspace skills（你自己写的） | ❌ 不会 |
| `~/.agents/skills/` | 用户全局 skills | ❌ 不会 |
| OpenClaw 安装目录 `skills/` | 内置 skills | ✅ 随版本更新 |

> 💡 建议把自定义 Skill 放在 `~/clawd/skills/`。

## 最简 Skill — 5 分钟上手

创建一个"代码审查"Skill：

```bash
mkdir -p ~/clawd/skills/code-review
cat > ~/clawd/skills/code-review/SKILL.md << 'EOF'
---
name: code-review
description: 代码审查助手。当用户说"审查代码"、"review"、"帮我看看这段代码"时触发。
---

# Code Review

当用户要求代码审查时，按以下步骤执行：

1. 读取用户指定的文件或 git diff
2. 从以下维度审查：
   - 逻辑正确性
   - 边界条件
   - 错误处理
   - 命名规范
   - 性能隐患
3. 输出格式：每个问题标注严重级别（🔴 严重 / 🟡 建议 / 🟢 优化）
4. 最后给出总体评价

## 规则
- 不修改代码，只审查
- 发现安全问题优先级最高
- 没问题就说没问题，不硬凑
EOF
```

完成。下次对话中说"帮我 review 一下 src/main.ts"，AI 就会按这个 Skill 执行。

## SKILL.md 格式规范

### Frontmatter（必须）

```yaml
---
name: my-skill            # Skill 标识名
description: >            # 触发描述（AI 靠这个匹配）
  一句话描述功能和触发条件。
  当用户说"关键词A"、"关键词B"时触发。
metadata:                 # 可选：元数据
  openclaw:
    emoji: "🔧"           # 显示用 emoji
    requires:             # 依赖检查
      anyBins: ["python3"]
---
```

**`description` 写法要点**：
- 第一句说**做什么**
- 第二句说**什么时候触发**（列出关键词）
- 也可以写**不做什么**（避免误匹配）

好的 description：
```
代码审查助手。当用户说"审查代码"、"review"、"code review"时触发。不用于代码生成或重构。
```

差的 description：
```
一个有用的工具。
```

### 正文（指令）

正文是给 AI 看的执行指令。写法原则：

1. **步骤清晰**：用编号列表写步骤
2. **规则明确**：用 `## 规则` 写约束
3. **引用相对路径**：`references/api.md` 而不是绝对路径
4. **控制 context 大小**：正文建议 < 300 行（会占用对话上下文）

### 引用参考文档

大量参考资料放 `references/` 目录，SKILL.md 中按需引用：

```markdown
# My Skill

执行步骤：
1. 先读取 API 文档：`references/api-docs.md`
2. 根据文档中的接口定义...
```

AI 只在需要时才会读 `references/` 下的文件，不会一次性全加载。

## 进阶结构

复杂 Skill 的完整目录：

```
advanced-skill/
├── SKILL.md                   # AI 行为指令
├── references/
│   ├── api-docs.md            # API 参考
│   └── examples.md            # 示例
├── scripts/
│   ├── main.py                # 执行脚本
│   └── utils.py               # 工具函数
├── templates/
│   └── output.md              # 输出模板
├── pyproject.toml             # Python 依赖（如有）
└── run.sh                     # 入口脚本（如有）
```

### 脚本集成

Skill 可以调用脚本来执行复杂操作：

```markdown
# My Skill

## 执行步骤
1. 收集用户输入
2. 运行分析脚本：`bash scripts/analyze.sh <参数>`
3. 读取输出并总结
```

脚本入口建议用 `run.sh`，统一管理依赖和环境：

```bash
#!/bin/bash
# run.sh - Skill 入口
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

# 确保 Python 虚拟环境
if [ ! -d ".venv" ]; then
    python3 -m venv .venv
    .venv/bin/pip install -r requirements.txt
fi

.venv/bin/python scripts/main.py "$@"
```

## 测试 Skill

### 手动测试

1. 确认目录和文件名正确
2. 在对话中用触发关键词测试
3. 检查 AI 是否正确加载了你的 Skill

```
你：帮我审查一下 src/main.ts 的代码
AI：（应该按 code-review Skill 执行）
```

### 检查已注册的 Skills

```bash
openclaw skills list
```

确认你的 Skill 出现在列表中。如果没有，检查：
- `SKILL.md` 是否存在
- 目录是否在正确位置（`~/clawd/skills/`）
- YAML frontmatter 格式是否正确

## 发布到 ClawHub

写好的 Skill 可以发布到 [ClawHub](https://clawhub.com) 社区：

```bash
# 安装 ClawHub CLI（如未安装）
npm install -g clawhub

# 发布
cd ~/clawd/skills/my-skill
clawhub publish
```

发布前检查清单：
- [ ] description 清晰、触发词准确
- [ ] 没有硬编码的路径或个人信息
- [ ] 有 README 或 SKILL.md 中有足够的说明
- [ ] 脚本有错误处理
- [ ] 在干净环境下测试过

## 最佳实践

1. **description 是关键**：AI 靠它匹配，写不好就不会被触发
2. **Context 预算**：SKILL.md 正文 + references 总共建议 < 8K tokens
3. **幂等性**：Skill 可能被多次触发，确保重复执行不会出问题
4. **错误处理**：脚本要处理失败情况，给出有用的错误信息
5. **不要太大**：一个 Skill 做一件事。想做多件事？拆成多个 Skill
6. **相对路径**：SKILL.md 中引用文件用相对路径，AI 会自动解析

---

> 相关文档：[Skills 扩展指南](SKILLS-GUIDE.md) · [ClawHub 社区](https://clawhub.com)
