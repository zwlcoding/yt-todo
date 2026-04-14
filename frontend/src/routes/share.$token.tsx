import { createRoute, useParams, Link } from '@tanstack/react-router'
import { Route as rootRoute } from './__root'
import { useEffect, useState } from 'react'

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/share/$token',
  component: ShareTokenComponent,
})

function ShareTokenComponent() {
  const { token } = useParams({ strict: false })
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState('完成任务')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/share/${token}`)
      .then((res) => {
        if (!res.ok) throw new Error('加载失败')
        return res.text()
      })
      .then((html) => {
        const regex = new RegExp('<meta[^\u003e]*property="og:title"[^\u003e]*content="([^"]*)"')
        const match = html.match(regex)
        if (match) setTitle(match[1])
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [token])

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
        {loading ? (
          <p className="text-slate-500">加载中...</p>
        ) : error ? (
          <>
            <div className="text-5xl mb-4">😕</div>
            <h1 className="text-xl font-bold text-slate-800 mb-2">分享链接无效</h1>
            <p className="text-slate-500 mb-6">{error}</p>
            <Link
              to="/"
              className="inline-block px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition"
            >
              回到首页
            </Link>
          </>
        ) : (
          <>
            <div className="text-5xl mb-4">🎉</div>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">{title}</h1>
            <p className="text-slate-500 mb-6">有人完成了一个任务，快来 YT-Todo 创建自己的待办清单吧！</p>
            <Link
              to="/"
              className="inline-block px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition"
            >
              开始使用
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
