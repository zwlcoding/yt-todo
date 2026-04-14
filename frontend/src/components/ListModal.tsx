import { useState } from 'react'

interface ListModalProps {
  onCreate: () => void
  onJoin: (token: string) => void
  onClose: () => void
}

export function ListModal({ onCreate, onJoin, onClose }: ListModalProps) {
  const [joinToken, setJoinToken] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleJoin = async () => {
    if (!joinToken.trim()) return
    setLoading(true)
    setError(null)
    try {
      await onJoin(joinToken.trim())
    } catch (e) {
      setError(e instanceof Error ? e.message : '加入失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="list-modal-title"
    >
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        <h3 id="list-modal-title" className="text-lg font-bold text-slate-800 mb-4">协作清单</h3>
        <div className="space-y-3">
          <button
            onClick={onCreate}
            className="w-full px-4 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition"
          >
            创建共享清单
          </button>
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-500">或</span>
            </div>
          </div>
          <input
            type="text"
            value={joinToken}
            onChange={(e) => setJoinToken(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
            placeholder="输入清单 Token"
            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
          <button
            onClick={handleJoin}
            disabled={loading || !joinToken.trim()}
            className="w-full px-4 py-2.5 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? '加入中...' : '加入共享清单'}
          </button>
        </div>
        <button
          onClick={onClose}
          className="mt-4 w-full px-4 py-2.5 bg-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-300 transition"
        >
          取消
        </button>
      </div>
    </div>
  )
}
