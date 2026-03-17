# fix-issues-14-15

**Status:** approved
**Type:** bugfix
**Issues:** #14, #15

## 目标
修复两个用户报告的 bug：
1. #14: OpenClaw 3.12 升级后 cron session 报错 `Missing workspace template: AGENTS.md`
2. #15: Dashboard 升级页面不刷新状态 + npm ENOTEMPTY 因 gateway 占用文件

## 改什么
1. `setup.sh` — 部署 workspace 时从 openclaw npm 包同步 `docs/reference/templates/` 目录
2. `safe-upgrade-openclaw.sh` — Phase 3 npm install 前先 kill gateway 进程释放文件锁
3. `use-upgrade-action.ts` — 升级完成后无论成败都刷新版本信息

## 怎么验
- `bash -n setup.sh` / `bash -n safe-upgrade-openclaw.sh` 语法检查通过
- `npx tsc --noEmit` 通过
- `bats tests/setup.bats` 全绿
- `npx vitest run` upgrade 相关测试全绿

## 不做什么
- 不改 OpenClaw 本体代码
- 不改 dashboard 升级 API 后端

## 影响
- setup.sh 新增一个 rsync 步骤，幂等无副作用
- safe-upgrade 新增 Phase 2.5，升级前先停 gateway（Phase 5 会重启）
- dashboard 前端在报错时也刷新版本，用户能看到实际结果
