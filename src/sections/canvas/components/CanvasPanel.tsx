import { useState, useEffect, useRef } from 'react'

export interface CanvasDocument {
  id: string
  title: string
  content: string
  type: 'report' | 'email' | 'code' | 'table' | 'generic'
  createdAt: number
  sourceMessageId?: string
}

interface CanvasPanelProps {
  document?: CanvasDocument
  onClose?: () => void
  onExportPDF?: () => void
  onCopyMarkdown?: () => void
}

interface TocItem {
  id: string
  text: string
  level: number
}

function extractToc(content: string): TocItem[] {
  const lines = content.split('\n')
  const items: TocItem[] = []
  for (const line of lines) {
    const match = line.match(/^(#{1,3})\s+(.+)$/)
    if (match) {
      items.push({
        id: match[2].toLowerCase().replace(/[^a-z0-9\u4e00-\u9fff]+/g, '-'),
        text: match[2],
        level: match[1].length,
      })
    }
  }
  return items
}

export function CanvasPanel({
  document: doc,
  onClose,
  onExportPDF,
  onCopyMarkdown,
}: CanvasPanelProps) {
  const [showToc, setShowToc] = useState(true)
  const [showExportMenu, setShowExportMenu] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  if (!doc) return null

  const toc = extractToc(doc.content)

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between h-12 px-4 border-b border-neutral-300 dark:border-neutral-800">
        <span className="font-mono text-xs font-bold uppercase tracking-tight text-black dark:text-white truncate">
          {doc.title}
        </span>
        <div className="flex items-center gap-1">
          {/* TOC toggle */}
          <button
            onClick={() => setShowToc(!showToc)}
            className={`w-7 h-7 flex items-center justify-center rounded-none ${
              showToc ? 'text-black dark:text-white' : 'text-neutral-500'
            } hover:text-black dark:hover:text-white`}
            title="Table of Contents"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 3h10M2 7h7M2 11h10" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </button>

          {/* Export */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="w-7 h-7 flex items-center justify-center text-neutral-500 hover:text-black dark:hover:text-white rounded-none"
              title="Export"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="2" y="1" width="10" height="12" stroke="currentColor" strokeWidth="1.2" />
                <path d="M5 5h4M5 7h4M5 9h2" stroke="currentColor" strokeWidth="1" />
              </svg>
            </button>
            {showExportMenu && (
              <div className="absolute right-0 top-full mt-1 w-36 bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-none z-10">
                <button
                  onClick={() => { onExportPDF?.(); setShowExportMenu(false) }}
                  className="w-full px-3 py-2 text-left text-xs font-mono uppercase text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-900"
                >
                  EXPORT PDF
                </button>
                <button
                  onClick={() => { onCopyMarkdown?.(); setShowExportMenu(false) }}
                  className="w-full px-3 py-2 text-left text-xs font-mono uppercase text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-900"
                >
                  COPY MARKDOWN
                </button>
              </div>
            )}
          </div>

          {/* Close */}
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center text-neutral-500 hover:text-black dark:hover:text-white rounded-none"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </button>
        </div>
      </div>

      {/* TOC */}
      {showToc && toc.length > 0 && (
        <div className="px-4 py-3 bg-neutral-100 dark:bg-neutral-900 border-b border-neutral-300 dark:border-neutral-800">
          <div className="space-y-1">
            {toc.map((item) => (
              <button
                key={item.id}
                className="block text-left w-full text-xs font-sans text-neutral-500 hover:text-black dark:hover:text-white"
                style={{ paddingLeft: `${(item.level - 1) * 12}px` }}
              >
                {item.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      <div ref={contentRef} className="flex-1 overflow-y-auto px-6 py-4">
        {/* Simple markdown rendering — in production would use a proper renderer */}
        <div className="prose prose-sm dark:prose-invert max-w-none font-sans leading-relaxed text-neutral-700 dark:text-neutral-300">
          {doc.content.split('\n').map((line, i) => {
            if (line.startsWith('# ')) {
              return (
                <h1 key={i} className="font-mono text-xl font-bold uppercase mt-8 mb-4 text-black dark:text-white">
                  {line.slice(2)}
                </h1>
              )
            }
            if (line.startsWith('## ')) {
              return (
                <h2 key={i} className="font-mono text-base font-bold uppercase mt-6 mb-3 text-black dark:text-white">
                  {line.slice(3)}
                </h2>
              )
            }
            if (line.startsWith('### ')) {
              return (
                <h3 key={i} className="font-sans text-sm font-bold mt-4 mb-2 text-black dark:text-white">
                  {line.slice(4)}
                </h3>
              )
            }
            if (line.startsWith('> ')) {
              return (
                <blockquote key={i} className="border-l-2 border-orange-500 pl-4 text-neutral-500 italic my-2">
                  {line.slice(2)}
                </blockquote>
              )
            }
            if (line.startsWith('```')) {
              return null // simplified — skip code fences
            }
            if (line.trim() === '') {
              return <div key={i} className="h-3" />
            }
            return <p key={i} className="my-1">{line}</p>
          })}
        </div>
      </div>
    </div>
  )
}
