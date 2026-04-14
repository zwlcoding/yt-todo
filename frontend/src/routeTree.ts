import { Route as rootRoute } from './routes/__root'
import { Route as indexRoute } from './routes/index'
import { Route as listsTokenRoute } from './routes/lists.$token'
import { Route as shareTokenRoute } from './routes/share.$token'
import { Route as joinRoute } from './routes/join'

export const routeTree = rootRoute.addChildren([
  indexRoute,
  listsTokenRoute,
  shareTokenRoute,
  joinRoute,
])
