
import { Inject, Service } from "ioc-di";
import { OutlinerService } from "../../../Outliner/service";

@Service()
export default class HomeService {
  @Inject(OutlinerService) outliner!: OutlinerService
}