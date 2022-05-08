import { Concat, Service } from "ioc-di"
import { IRouteLink } from "../RouteLink"

export interface IRoute {
  path: string,
  component: Vue.VueConstructor
  Service: any
  service?: any
}

@Service()
export default class RouterService {
  active: IRoute = {} as IRoute
  routers: IRoute[] = []

  to (link: IRouteLink) {
    const route = this.routers.find(it => it.path === link.path)
    if (!route) {
      throw new Error(`route not found: ${link.path}`)
    }
    this.setRoute(route)
  }

  setRouters (routes: IRoute[]) {
    this.routers = routes.map(it => {
      return {
        ...it,
        service: null
      }
    })

    this.setRoute(routes[0])
  }

  setRoute (route: IRoute) {
    // if (!route.service) {
    // 复用service
    route.service = Concat(this, new route.Service())
    // }
    window.location.hash = route.path
    this.active = route
  }
}
