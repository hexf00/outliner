import { Inject, Root, Service } from "ioc-di";
import { CSVService } from "../CSV/service";

@Root()
@Service()
export default class AppService {
  @Inject(CSVService) csv !: CSVService
}