import { createRoute, useSearch, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { Route as rootRoute } from './__root'

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/join',
  component: JoinComponent,
  validateSearch: (search: Record<string, unknown>) => ({
    token: (search.token as string) || '',
  }),
})

function JoinComponent() {
  const search = useSearch({ strict: false })
  const token = typeof search.token === 'string' ? search.token : ''
  const navigate = useNavigate()
  const [loading, setLoading] = useState(Boolean(token))
  const [error, setError] = useState<string | null>(token ? null : '缺少邀请 Token')
  const [listName, setListName] = useState('')

  useEffect(() => {
    if (!token) return

    api
      .getList(token)
      .then((list) => {
        setListName(list.name)
        localStorage.setItem('yt-todo-list-token', token)
        setTimeout(() => {
          navigate({ to: '/lists/$token', params: { token } })
        }, 1500)
      })
      .catch((e: Error) => {
        setError(e instanceof Error ? e.message : '清单不存在')
      })
      .finally(() => setLoading(false))
  }, [token, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
        {loading ? (
          <>
            <div className="text-5xl mb-4">🤝</div>
            <p className="text-slate-500">正在加入协作清单...</p>
          </>
        ) : error ? (
          <>
            <div className="text-5xl mb-4">😕</div>
            <h1 className="text-xl font-bold text-slate-800 mb-2">加入失败</h1>
            <p className="text-slate-500 mb-6">{error}</p>
            <a
              href="/"
              className="inline-block px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition"
            >
              回到首页
            </a>
          </>
        ) : (
          <>
            <div className="text-5xl mb-4">✅</div>
            <h1 className="text-xl font-bold text-slate-800 mb-2">成功加入「{listName}」</h1>
            <p className="text-slate-500">正在跳转...</p>
          </>
        )}
      </div>
    </div>
  )
}
