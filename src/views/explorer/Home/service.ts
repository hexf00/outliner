
import { Inject, Service } from "ioc-di";
import ExplorerService from "../Explorer/service";

@Service()
export default class HomeService {
  @Inject(ExplorerService) explorer!: ExplorerService
}