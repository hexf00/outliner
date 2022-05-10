import RouterService from "../components/Router/service";

export const routers = [
  {
    path: '/outliner',
    component: () => import("../views/outliner/Home"),
    Service: () => import("../views/outliner/Home/service")
  },
  {
    path: '/csv',
    component: () => import("../views/csv/Home"),
    Service: () => import("../views/csv/Home/service"),
  }
] as const

export type paths = typeof routers[number]['path']
export const router = new RouterService()

router.setRouters(routers)
