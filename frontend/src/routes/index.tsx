import { createRoute, useNavigate } from '@tanstack/react-router'
import { Route as rootRoute } from './__root'
import { TodoApp } from '../components/TodoApp'

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: IndexComponent,
})

function IndexComponent() {
  const navigate = useNavigate()

  const handleJoinList = (token: string) => {
    if (token) {
      navigate({ to: '/lists/$token', params: { token } })
    } else {
      navigate({ to: '/' })
    }
  }

  return <TodoApp onJoinList={handleJoinList} />
}
