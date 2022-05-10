import { Concat, Service } from "ioc-di"
import { IRouteLink } from "../RouteLink"

export interface IRoute {
  name: string,
  component: Vue.VueConstructor | Vue.AsyncComponent
  Service: any
  service?: any
}

@Service()
export default class RouterService {
  active: IRoute = {} as IRoute
  routers: readonly IRoute[] = []

  to (link: IRouteLink) {
    const route = this.routers.find(it => it.name === link.name)
    if (!route) {
      throw new Error(`route not found: ${link.name}`)
    }
    this.setRoute(route)
  }

  setRouters (routes: readonly IRoute[]) {
    this.routers = routes.map(it => {
      return {
        ...it,
        service: null
      }
    })

    this.setRoute(routes[0])
  }

  async setRoute (route: IRoute) {
    // 是否需要在这里复用service，考虑到ioc容器已经通过token进行了标记
    if (!route.Service.prototype) {
      // 为异步模块
      route.service = Concat(this, new (await route.Service()).default)
    } else {
      route.service = Concat(this, new route.Service())
    }

    window.location.hash = route.name
    this.active = route
  }
}
