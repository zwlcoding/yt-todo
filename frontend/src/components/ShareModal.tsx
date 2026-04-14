import { useState } from 'react'

interface ShareModalProps {
  url: string
  onClose: () => void
  onCopy?: () => void
}

export function ShareModal({ url, onClose, onCopy }: ShareModalProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    onCopy?.()
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-title"
    >
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        <h3 id="share-title" className="text-lg font-bold text-slate-800 mb-2">任务已完成！</h3>
        <p className="text-slate-600 mb-4">生成分享卡片，让更多人看到你的成就。</p>
        <div className="p-3 bg-slate-100 rounded-xl text-sm break-all mb-4 text-slate-700">
          {url}
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleCopy}
            className="flex-1 px-4 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition"
          >
            {copied ? '已复制' : '复制链接'}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-300 transition"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  )
}
