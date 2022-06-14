import { Concat, Inject, Service } from "ioc-di";
import ListService from "../../components/List/service";
import CanvasService from "../Canvas/service";
import LineService from "../Line/service";

@Service()
export default class Mapping {

  @Inject(CanvasService) canvas !: CanvasService

  target: ListService | undefined
  source: ListService | undefined


  setSource (source: ListService) {
    this.source = source

    this.source.onSizeChange(() => {
      this.canvas.rerender()
    })
  }

  setTarget (target: ListService) {
    this.target = target


    this.target.onSizeChange(() => {
      this.canvas.rerender()
    })
  }

  addEdge ({ source, target }: { source: any, target: any }) {
    if (!this.source || !this.target) throw new Error("source or target is undefined")

    const sourceIndex = this.source.getIndex(source)
    const targetIndex = this.target.getIndex(target)


    const line = Concat(this, new LineService());
    line.setData({ source: sourceIndex, target: targetIndex })
    this.canvas.paths.push(line)

    // console.log(sourceIndex, targetIndex)

  }

}