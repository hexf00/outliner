
import { Already, Concat, Container, Inject, Service } from "ioc-di";
import ListService from "../components/List/service";
import CanvasService from "../services/Canvas/service";
import Mapping from "../services/mapping";


@Container()
@Service()
export default class HomeService {

  left = Concat(this, new ListService())
  right = Concat(this, new ListService())

  @Inject(Mapping) mapping!: Mapping

  @Inject(CanvasService) canvas !: CanvasService

  constructor () {


    this.init()
  }

  @Already
  init () {
    //生成26个字母数组
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")
    const lower = "abcdefghijklmnopqrstuvwxyz".split("")


    this.left.setData(upper)
    this.right.setData(lower)

    this.mapping.setSource(this.left)
    this.mapping.setTarget(this.right)

    this.mapping.addEdge({
      source: this.left.data[0],
      target: this.right.data[5],
    })


    this.mapping.addEdge({
      source: this.left.data[3],
      target: this.right.data[6],
    })
    this.mapping.addEdge({
      source: this.left.data[1],
      target: this.right.data[25],
    })
  }


}