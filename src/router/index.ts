import RouterService from "../components/Router/service";

export const routers = [
  {
    name: 'outliner',
    component: () => import("../views/outliner/Home"),
    Service: () => import("../views/outliner/Home/service")
  },
  {
    name: 'csv',
    component: () => import("../views/csv/Home"),
    Service: () => import("../views/csv/Home/service"),
  },
  {
    name: 'explorer',
    component: () => import("../views/explorer/Home"),
    Service: () => import("../views/explorer/Home/service"),
  }
] as const

export type names = typeof routers[number]['name']

export const router = new RouterService()

router.setRouters(routers)
