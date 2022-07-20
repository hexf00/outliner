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
  },
  {
    name: 'editor',
    component: () => import("../views/editor/Home"),
    Service: () => import("../views/editor/Home/service"),
  },
  {
    name: 'iframe',
    component: () => import("../views/iframe/Home"),
    Service: () => import("../views/iframe/Home/service"),
  },
  {
    name: 'images',
    component: () => import("../views/images/Home"),
    Service: () => import("../views/images/Home/service"),
  },
  {
    name: 'jsplumb',
    component: () => import("../views/jsplumb/Home"),
    Service: () => import("../views/jsplumb/Home/service"),
  },
  {
    name: 'mapping',
    component: () => import("../views/mapping/Home"),
    Service: () => import("../views/mapping/Home/service"),
  },
  {
    name: 'pos',
    component: () => import("../views/pos/Home"),
    Service: () => import("../views/pos/Home/service"),
  },
  {
    name: 'faker',
    component: () => import("../views/faker/Home"),
    Service: () => import("../views/faker/Home/service"),
  },
  {
    name: 'mapper',
    component: () => import("../views/mapper/Home"),
    Service: () => import("../views/mapper/Home/service"),
  },
  {
    name: 'memory',
    component: () => import("../views/memory/Home"),
    Service: () => import("../views/memory/Home/service"),
  }
] as const

export type names = typeof routers[number]['name']

export const router = new RouterService()

router.setRouters(routers)
