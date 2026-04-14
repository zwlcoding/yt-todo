export interface Todo {
  id: string
  listId: string | null
  title: string
  completed: boolean
  dueDate: string | null
  shareToken: string | null
  createdAt: string
  updatedAt: string
}

export interface List {
  id: string
  name: string
  shareToken: string
  createdAt: string
  todos?: Todo[]
}

const API_BASE = import.meta.env.VITE_API_BASE || ''

async function fetchJson<T>(input: string, init?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {}
  if (init?.body) {
    headers['Content-Type'] = 'application/json'
  }

  const res = await fetch(`${API_BASE}${input}`, {
    ...init,
    headers: {
      ...headers,
      ...init?.headers,
    },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(err.error || `HTTP ${res.status}`)
  }
  if (res.status === 204) {
    return undefined as T
  }
  const json = await res.json()
  return json.data as T
}

export const api = {
  getHealth: () => fetchJson<{ status: string; db: string }>('/health'),

  getTodos: () => fetchJson<Todo[]>('/api/todos'),

  createTodo: (title: string, listToken?: string) =>
    fetchJson<Todo>(
      listToken ? `/api/lists/${listToken}/todos` : '/api/todos',
      {
        method: 'POST',
        body: JSON.stringify({ title, listToken }),
      }
    ),

  completeTodo: (id: string) =>
    fetchJson<Todo>(`/api/todos/${id}/complete`, {
      method: 'PATCH',
    }),

  deleteTodo: (id: string) =>
    fetchJson<void>(`/api/todos/${id}`, { method: 'DELETE' }),

  seedTodos: () =>
    fetchJson<Todo[]>('/api/todos/seed', { method: 'POST' }),

  createList: (name: string) =>
    fetchJson<List>('/api/lists', {
      method: 'POST',
      body: JSON.stringify({ name }),
    }),

  getList: (token: string) =>
    fetchJson<List>(`/api/lists/${token}`),

  trackEvent: (eventName: string, properties?: Record<string, unknown>) =>
    fetchJson<unknown>('/api/events', {
      method: 'POST',
      body: JSON.stringify({ eventName, properties }),
    }),
}
