import { Inject, Root, Service } from "ioc-di";
import RouterService from "../../components/Router/service";
import { router } from "../../router";

@Root()
@Service()
export default class AppService {
  @Inject(RouterService) router: RouterService = router
}