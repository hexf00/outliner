
import { Inject, Service } from "ioc-di";
import { CSVService } from "../CSV/service";

@Service()
export default class HomeService {
  @Inject(CSVService) csv !: CSVService
}