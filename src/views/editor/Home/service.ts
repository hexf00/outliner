
import { Inject, Service } from "ioc-di";
import { EditorService } from "../Editor/service";

@Service()
export default class HomeService {
  @Inject(EditorService) editor!: EditorService
}