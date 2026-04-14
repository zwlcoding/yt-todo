import { createRoute, useParams } from '@tanstack/react-router'
import { Route as rootRoute } from './__root'
import { TodoApp } from '../components/TodoApp'

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/lists/$token',
  component: ListsTokenComponent,
})

function ListsTokenComponent() {
  const { token } = useParams({ strict: false })

  return <TodoApp listToken={token} />
}
