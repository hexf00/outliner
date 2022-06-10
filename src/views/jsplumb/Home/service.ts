
import { Container, Service } from "ioc-di";
import ListService from "../components/List/service";
import DragMapping from "../services/jsplumb/mapping";


@Container()
@Service()
export default class HomeService {

  left = new ListService()
  right = new ListService()

  mapping = new DragMapping()

  constructor () {
    this.left.setData(['a', 'b', 'c'])
    this.right.setData(['A', 'B', 'C'])
  }
}