import { useState } from 'react'

export default function CodeBlock({ children, className }: { children: React.ReactNode, className?: string }) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    let textToCopy = ''
    if (typeof children === 'string') {
      textToCopy = children
    } else if (children && typeof children === 'object' && 'props' in (children as any)) {
      // If it's the <code> child inside <pre>
      const props = (children as any).props
      textToCopy = props.children || ''
    }

    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
    }
  }

  return (
    <div className="my-6 terminal-box overflow-hidden">
      <div className="flex justify-between items-center bg-green-900/20 border-b border-green-700 px-4 py-2">
        <div className="text-[10px] font-bold uppercase tracking-widest opacity-70">
          {className?.replace('language-', '') || 'SOURCE_CODE'}
        </div>
        <button
          onClick={copyToClipboard}
          className="text-[var(--terminal-green)] bg-[var(--terminal-bg)] border border-[var(--terminal-green)] px-3 py-0.5 text-[10px] font-mono hover:bg-[var(--terminal-green)] hover:text-[var(--terminal-bg)] transition-all uppercase tracking-tighter"
        >
          {copied ? 'COPIED!' : 'COPY'}
        </button>
      </div>
      <pre className={`${className} overflow-x-auto p-4 bg-transparent`}>
        {children}
      </pre>
    </div>
  )
}
