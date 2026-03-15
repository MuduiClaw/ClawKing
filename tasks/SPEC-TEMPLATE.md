# Spec: <标题>

> **Status**: draft
> **Author**: <Partner/Mudui>
> **Created**: YYYY-MM-DD

## 一句话

<一句话说清楚这个变更做什么>

## 背景

<为什么要做？现状是什么？痛点在哪？>

## 交付物

### T1: <子任务名>
- **改什么**: <具体文件/模块>
- **怎么验**: <可执行的验证命令或检查项>
- **不做什么**: <边界>
- **影响**: <影响范围>

### T2: <子任务名>
- **改什么**: ...
- **怎么验**: ...
- **不做什么**: ...
- **影响**: ...

## Showboat 验收（脚本 / 配置 / API 类任务必须）

> 非 UI 类任务必须用 `showboat exec` 录制命令+输出作为交付证据。
> 初始化：`bash scripts/showboat-report.sh <slug> <dir>`
> 产出：`docs/acceptance/<slug>/report.md`
> 复验：`showboat verify docs/acceptance/<slug>/report.md`（exit 0 = 通过）
> 混合任务（既有 UI 又有 API）：截图 + showboat 都要。

- [ ] `showboat verify report.md` exit 0（如适用）

## 不做什么

- <明确列出不做的事情，防止范围蔓延>

## 执行顺序

T1 → T2 → ...

## 风险

- <可能出问题的点 + 应对方案>

---

## Status 流转

draft → approved (Mudui 审批) → in_progress → done

## Oracle Review

<!-- 由 oracle-gemini 自动填充 -->
