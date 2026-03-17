# ClawKing — Product Roadmap

## Sections

### 1. Home（首页/默认对话）
- **Description**: 用户进入后的默认界面，主对话频道。Agent 在此主动打招呼、展示能力、响应日常指令。
- **Priority**: Wave 0
- **Key Features**: 消息流（Agent 5+1 种消息类型渲染）、输入框、快速指令面板

### 2. Channel List（频道列表/侧边栏）
- **Description**: 左侧导航——Server → Category → Channel 层级树。支持折叠 Category、切换 Channel、显示未读计数。
- **Priority**: Wave 0
- **Key Features**: Server 切换、Category 折叠、Channel 列表、未读 badge、新建频道

### 3. Canvas（富文档面板）
- **Description**: 右侧面板，展示 Agent 生成的长篇报告、邮件预览、代码产出。支持目录导航、章节折叠、PDF 导出。
- **Priority**: Wave 1
- **Key Features**: Markdown 完整渲染、目录、代码高亮、PDF 导出

### 4. Cron Panel（定时任务面板）
- **Description**: Cron 定时任务的创建、编辑、查看和管理。显示运行历史、下次执行时间、状态。
- **Priority**: Wave 1
- **Key Features**: 任务列表、运行历史、开关、新建、频率配置

### 5. Skills Market（技能市场）
- **Description**: ClawHub 生态对接——搜索、浏览、安装、管理 Skills。显示预装 Skills 和市场推荐。
- **Priority**: Wave 1
- **Key Features**: 搜索、分类浏览、一键安装、已装管理、评分

### 6. Settings（设置中心）
- **Description**: 算力配置（Cloud/BYOS/模型选择）、Agent 人格（SOUL.md）、记忆管理（LCM）、频道管理、账号设置。
- **Priority**: Wave 1
- **Key Features**: 模型切换、BYOS Key 管理、SOUL.md 编辑器、LCM 可视化

### 7. Usage Dashboard（用量仪表盘）
- **Description**: Token 消耗、成本趋势、按模型/Skill/Cron 维度的用量分析。
- **Priority**: Wave 2
- **Key Features**: 用量图表、成本估算、趋势分析、按维度筛选

### 8. Onboarding（引导流程）
- **Description**: 注册 → Demo Server 体验 → 选模板 → Agent 主动对话补充配置。3 步不超过 5 分钟。
- **Priority**: Wave 1
- **Key Features**: Demo Server 预填数据、Server 模板卡片、授权引导

## Navigation Model
- **Primary**: 左侧边栏（Channel List）— 始终可见
- **Secondary**: 中间消息流 + 右侧 Canvas（可折叠）
- **Tertiary**: Cron/Skills/Settings/Usage 作为独立面板或浮层
