import RouterService from "../components/Router/service";

import Outliner from "../views/outliner/Home";
import OutlinerService from "../views/outliner/Home/service";

import CSV from "../views/csv/Home";
import CSVService from "../views/csv/Home/service";


export const router = new RouterService()

router.setRouters([
  {
    path: '/outliner',
    component: Outliner,
    Service: OutlinerService
  },
  {
    path: '/csv',
    component: CSV,
    Service: CSVService
  }
])