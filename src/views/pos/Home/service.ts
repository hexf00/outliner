
import { Container, Service } from "ioc-di";
import Pos from "../services/pos";

@Container()
@Service()
export default class HomeService {

  left = new Pos()
  right = new Pos()

  update () {
    this.left.update()
    this.right.update()
  }
}