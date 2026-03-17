import { useState } from 'react'
import { AppShell } from './components/AppShell'
import type { Server, Category } from './components/AppShell'

const servers: Server[] = [
  { id: 'work', name: '我的 Agent', initial: 'A', isActive: true },
  { id: 'content', name: '内容运营', initial: 'C' },
  { id: 'ecom', name: '电商运营', initial: 'E' },
]

const initialCategories: Category[] = [
  {
    id: 'common',
    label: '常用',
    isExpanded: true,
    channels: [
      { id: 'home', name: 'Home', type: 'chat', isActive: true, unreadCount: 0 },
      { id: 'work', name: '工作助手', type: 'chat', unreadCount: 3 },
      { id: 'content', name: '内容创作', type: 'chat', unreadCount: 0 },
    ],
  },
  {
    id: 'auto',
    label: '自动任务',
    isExpanded: true,
    channels: [
      { id: 'cron-daily', name: 'Cron 日报', type: 'cron', unreadCount: 12 },
      { id: 'cron-alert', name: 'Cron 告警', type: 'cron', unreadCount: 1 },
    ],
  },
]

export default function ShellPreview() {
  const [categories, setCategories] = useState(initialCategories)
  const [isSidebarOpen, setSidebarOpen] = useState(false)
  const [isCanvasOpen, setCanvasOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'chat' | 'agent' | 'cron' | 'skills' | 'settings'>('chat')

  const handleCategoryToggle = (id: string) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === id ? { ...cat, isExpanded: !cat.isExpanded } : cat
      )
    )
  }

  const handleChannelSelect = (id: string) => {
    setCategories((prev) =>
      prev.map((cat) => ({
        ...cat,
        channels: cat.channels.map((ch) => ({
          ...ch,
          isActive: ch.id === id,
        })),
      }))
    )
  }

  return (
    <AppShell
      servers={servers}
      categories={categories}
      user={{ name: 'mudui' }}
      activeTab={activeTab}
      isSidebarOpen={isSidebarOpen}
      isCanvasOpen={isCanvasOpen}
      canvas={
        <div className="p-6">
          <h2 className="font-['IBM_Plex_Mono',monospace] text-sm font-bold uppercase tracking-tight mb-4">
            WEEKLY REPORT
          </h2>
          <p className="text-sm text-neutral-400 font-['IBM_Plex_Sans',sans-serif] leading-relaxed">
            Agent 本周完成了 47 个任务，包括 12 次邮件摘要、8 次竞品监控、15 条社媒内容生成、12 个 Cron 定时任务执行。
          </p>
        </div>
      }
      onCategoryToggle={handleCategoryToggle}
      onChannelSelect={handleChannelSelect}
      onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
      onToggleCanvas={() => setCanvasOpen(!isCanvasOpen)}
      onNavigate={(tab) => setActiveTab(tab as typeof activeTab)}
      onLogout={() => console.log('Logout')}
    >
      {/* Content area — message flow mock */}
      <div className="flex flex-col h-full">
        {/* Channel header */}
        <div className="hidden md:flex items-center justify-between h-12 px-4 border-b border-[#292929]">
          <div className="flex items-center gap-2">
            <span className="text-neutral-600">#</span>
            <span className="font-['IBM_Plex_Mono',monospace] text-sm font-bold uppercase tracking-tight">
              HOME
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCanvasOpen(!isCanvasOpen)}
              className="text-neutral-500 hover:text-white px-2 py-1 text-xs font-['IBM_Plex_Mono',monospace] uppercase border border-[#292929] hover:border-neutral-500 rounded-none"
            >
              CANVAS
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Agent message — thinking */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#ff8800] flex items-center justify-center font-['IBM_Plex_Mono',monospace] text-xs font-bold text-black rounded-none">
                CK
              </div>
              <span className="font-['IBM_Plex_Sans',sans-serif] text-sm font-semibold">ClawKing Agent</span>
              <span className="font-['IBM_Plex_Mono',monospace] text-[10px] text-neutral-600 uppercase">
                TODAY 09:00
              </span>
            </div>
            <div className="ml-10 text-sm text-neutral-300 font-['IBM_Plex_Sans',sans-serif] leading-relaxed">
              早上好。已完成今日 Cron 任务：
            </div>
            <div className="ml-10 border border-[#292929] bg-[#141414] p-3 rounded-none">
              <div className="font-['IBM_Plex_Mono',monospace] text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-2">
                ⏰ CRON OUTPUT — 邮件日报
              </div>
              <div className="text-sm text-neutral-300 font-['IBM_Plex_Sans',sans-serif]">
                收到 23 封邮件，3 封需要回复，1 封紧急。
              </div>
            </div>
          </div>

          {/* User message */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#1a1a1a] border border-[#292929] flex items-center justify-center font-['IBM_Plex_Mono',monospace] text-xs font-bold text-neutral-400 rounded-none">
                M
              </div>
              <span className="font-['IBM_Plex_Sans',sans-serif] text-sm font-semibold">mudui</span>
              <span className="font-['IBM_Plex_Mono',monospace] text-[10px] text-neutral-600 uppercase">
                TODAY 09:15
              </span>
            </div>
            <div className="ml-10 text-sm text-neutral-300 font-['IBM_Plex_Sans',sans-serif] leading-relaxed">
              帮我看一下竞品最近发了什么新内容
            </div>
          </div>

          {/* Agent response with tool call */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#ff8800] flex items-center justify-center font-['IBM_Plex_Mono',monospace] text-xs font-bold text-black rounded-none">
                CK
              </div>
              <span className="font-['IBM_Plex_Sans',sans-serif] text-sm font-semibold">ClawKing Agent</span>
              <span className="font-['IBM_Plex_Mono',monospace] text-[10px] text-neutral-600 uppercase">
                TODAY 09:15
              </span>
            </div>
            {/* Thinking indicator */}
            <div className="ml-10 border border-[#292929] bg-[#0a0a0a] p-2 rounded-none">
              <div className="font-['IBM_Plex_Mono',monospace] text-[10px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                💭 THINKING
              </div>
              <div className="text-xs text-neutral-500 font-['IBM_Plex_Mono',monospace]">
                分析用户需求 → 调用 blogwatcher + crawl4ai...
              </div>
            </div>
            {/* Tool call */}
            <div className="ml-10 border border-[#292929] bg-[#141414] p-2 rounded-none">
              <div className="font-['IBM_Plex_Mono',monospace] text-[10px] font-bold uppercase tracking-wider text-green-600 mb-1">
                🔧 TOOL CALL — blogwatcher scan
              </div>
              <div className="text-xs text-neutral-500 font-['IBM_Plex_Mono',monospace]">
                扫描 3 个竞品 RSS feed，发现 7 篇新文章...
              </div>
            </div>
            <div className="ml-10 text-sm text-neutral-300 font-['IBM_Plex_Sans',sans-serif] leading-relaxed">
              竞品过去 7 天发布了 7 篇新内容。其中 EasyClaw 发了 3 篇关于"数字员工"的营销文章，QClaw 更新了 2 篇使用教程。
              <span className="text-[#ff8800] cursor-pointer ml-1">→ 在 Canvas 中查看完整报告</span>
            </div>
          </div>
        </div>

        {/* Input area */}
        <div className="p-4 border-t border-[#292929]">
          <div className="flex items-center gap-2 bg-[#141414] border border-[#292929] px-4 py-3 rounded-none">
            <input
              type="text"
              placeholder="Message ClawKing Agent..."
              className="flex-1 bg-transparent text-sm text-white placeholder-neutral-600 font-['IBM_Plex_Sans',sans-serif] outline-none"
            />
            <button className="text-neutral-500 hover:text-white">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M7 1v14M1 7h14" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>
            <div className="w-px h-4 bg-[#292929]" />
            <span className="font-['IBM_Plex_Mono',monospace] text-[10px] text-neutral-600 uppercase">
              OPUS
            </span>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
