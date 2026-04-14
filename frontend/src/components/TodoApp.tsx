import { useState, useEffect, useRef, useCallback } from 'react'
import type { Todo, List } from '../lib/api'
import { api } from '../lib/api'
import { events } from '../events'
import { formatDueDate } from '../lib/utils'
import { ShareModal } from './ShareModal'
import { ListModal } from './ListModal'

interface TodoAppProps {
  listToken?: string
  onJoinList?: (token: string) => void
}

export function TodoApp({ listToken: initialListToken, onJoinList }: TodoAppProps) {
  const [todos, setTodos] = useState<Todo[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const [listToken, setListToken] = useState<string | null>(initialListToken || null)
  const [currentList, setCurrentList] = useState<List | null>(null)
  const [showListModal, setShowListModal] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const fetchTodos = useCallback(async () => {
    setError(null)
    try {
      if (listToken) {
        const list = await api.getList(listToken)
        setCurrentList(list)
        setTodos(list.todos || [])
      } else {
        const data = await api.getTodos()
        setTodos(data)
        setCurrentList(null)
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : '加载失败')
      console.error(e)
    }
  }, [listToken])

  useEffect(() => {
    setListToken(initialListToken || null)
  }, [initialListToken])

  useEffect(() => {
    fetchTodos()
    inputRef.current?.focus()
  }, [fetchTodos])

  const addTodo = async () => {
    if (!input.trim()) return
    setLoading(true)
    setError(null)
    try {
      const todo = await api.createTodo(input.trim(), listToken || undefined)
      setInput('')
      await fetchTodos()
      events.taskCreated(todo.id, !!todo.dueDate, listToken || undefined)
    } catch (e) {
      setError(e instanceof Error ? e.message : '添加失败')
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const completeTodo = async (id: string) => {
    try {
      const todo = await api.completeTodo(id)
      if (todo.shareToken) {
        const url = `${window.location.origin}/share/${todo.shareToken}`
        setShareUrl(url)
      }
      await fetchTodos()
      events.taskCompleted(todo.id, !!todo.dueDate, listToken || undefined)
    } catch (e) {
      setError(e instanceof Error ? e.message : '操作失败')
      console.error(e)
    }
  }

  const deleteTodo = async (id: string) => {
    try {
      await api.deleteTodo(id)
      await fetchTodos()
      events.taskDeleted(id, listToken || undefined)
    } catch (e) {
      setError(e instanceof Error ? e.message : '删除失败')
      console.error(e)
    }
  }

  const seedTodos = async () => {
    setLoading(true)
    setError(null)
    try {
      await api.seedTodos()
      await fetchTodos()
    } catch (e) {
      setError(e instanceof Error ? e.message : '初始化失败')
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateList = async () => {
    try {
      const list = await api.createList('我的共享清单')
      if (onJoinList) {
        onJoinList(list.shareToken)
      } else {
        localStorage.setItem('yt-todo-list-token', list.shareToken)
        setListToken(list.shareToken)
      }
      setShowListModal(false)
      events.inviteAccepted(list.shareToken)
    } catch (e) {
      setError(e instanceof Error ? e.message : '创建失败')
      console.error(e)
    }
  }

  const handleJoinList = async (token: string) => {
    try {
      await api.getList(token)
      if (onJoinList) {
        onJoinList(token)
      } else {
        localStorage.setItem('yt-todo-list-token', token)
        setListToken(token)
      }
      setShowListModal(false)
      events.inviteAccepted(token)
    } catch (e) {
      setError(e instanceof Error ? e.message : '加入失败')
      console.error(e)
    }
  }

  const leaveList = () => {
    localStorage.removeItem('yt-todo-list-token')
    setListToken(null)
    setCurrentList(null)
    if (onJoinList) {
      onJoinList('')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-6 md:p-8">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              {currentList ? currentList.name : 'YT-Todo'}
            </h1>
            {currentList && (
              <p className="text-sm text-slate-500 mt-1">协作清单</p>
            )}
          </div>
          <div className="flex gap-2">
            {listToken && (
              <button
                onClick={leaveList}
                className="px-3 py-1.5 text-sm font-medium bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition"
              >
                退出
              </button>
            )}
            <button
              onClick={() => setShowListModal(true)}
              className="px-3 py-1.5 text-sm font-medium bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition"
            >
              {listToken ? '切换' : '协作'}
            </button>
          </div>
        </header>

        {listToken && currentList && (
          <div className="mb-5 p-3 bg-indigo-50 rounded-xl text-sm text-indigo-800 flex items-center gap-2">
            <span className="font-medium">分享链接:</span>
            <code className="bg-white px-2 py-0.5 rounded text-indigo-600 break-all">
              {window.location.origin}/join?token={currentList.shareToken}
            </code>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-xl text-sm" role="alert">
            {error}
          </div>
        )}

        <div className="flex gap-2 mb-6">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTodo()}
            placeholder="输入新任务，支持自然语言日期（如：明天下午3点开会）..."
            className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            aria-label="新任务"
          />
          <button
            onClick={addTodo}
            disabled={loading || !input.trim()}
            className="px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            添加
          </button>
        </div>

        <ul className="space-y-3" role="list" aria-label="任务列表">
          {todos.filter((todo) => !todo.completed).map((todo) => (
            <li
              key={todo.id}
              className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:bg-slate-100 transition"
            >
              <div className="flex flex-col min-w-0">
                <span className="text-slate-700 font-medium truncate">{todo.title}</span>
                {todo.dueDate && (
                  <span className="text-xs text-orange-600 mt-1 font-medium">
                    {formatDueDate(todo.dueDate)}
                  </span>
                )}
              </div>
              <div className="flex gap-2 ml-3 shrink-0">
                <button
                  onClick={() => completeTodo(todo.id)}
                  className="px-3 py-1.5 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  aria-label={`完成任务: ${todo.title}`}
                >
                  完成
                </button>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="px-3 py-1.5 text-sm font-medium bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  aria-label={`删除任务: ${todo.title}`}
                >
                  删除
                </button>
              </div>
            </li>
          ))}
        </ul>

        {todos.length === 0 && !listToken && (
          <div className="text-center mt-10 py-8">
            <div className="text-5xl mb-4">📝</div>
            <p className="text-slate-400 mb-5">暂无任务，添加一个吧！</p>
            <button
              onClick={seedTodos}
              disabled={loading}
              className="px-5 py-2.5 bg-blue-500 text-white font-medium rounded-xl hover:bg-blue-600 disabled:opacity-50 transition"
            >
              添加示例任务
            </button>
          </div>
        )}

        {todos.length === 0 && listToken && (
          <div className="text-center mt-10 py-8">
            <div className="text-5xl mb-4">🤝</div>
            <p className="text-slate-400">共享清单暂无任务，添加一个吧！</p>
          </div>
        )}
      </div>

      {shareUrl && (
        <ShareModal
          url={shareUrl}
          onClose={() => setShareUrl(null)}
          onCopy={() => events.shareClicked(shareUrl.split('/').pop() || '')}
        />
      )}

      {showListModal && (
        <ListModal
          onCreate={handleCreateList}
          onJoin={handleJoinList}
          onClose={() => setShowListModal(false)}
        />
      )}
    </div>
  )
}
