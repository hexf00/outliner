import { Inject, Root, Service } from "ioc-di";
import { CSVService } from "../CSV/service";
import ExplorerService from "../Explorer/service";

@Root()
@Service()
export default class AppService {
  @Inject(CSVService) csv !: CSVService
  @Inject(ExplorerService) explorer!: ExplorerService
}