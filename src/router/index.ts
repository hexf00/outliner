import RouterService from "../components/Router/service";

export const router = new RouterService()

router.setRouters([
  {
    path: '/outliner',
    component: () => import("../views/outliner/Home"),
    Service: () => import("../views/outliner/Home/service")
  },
  {
    path: '/csv',
    component: () => import("../views/csv/Home"),
    Service: () => import("../views/csv/Home/service")
  }
])