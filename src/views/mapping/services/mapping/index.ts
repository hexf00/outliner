import { Concat, Inject, Service } from "ioc-di";
import CanvasService from "../Canvas/service";
import PathService from "../Path/service";

type IItem = unknown
interface IList {
  data: IItem[];
  isSource: boolean;
  isTarget: boolean;
  getIndex (item: IItem): number;
  onSizeChange (fn: () => void): void;
}

@Service()
export default class Mapping {

  @Inject(CanvasService) canvas !: CanvasService

  target: IList | undefined
  source: IList | undefined


  setSource (source: IList) {
    this.source = source
    this.source.isSource = true

    this.source.onSizeChange(() => {
      this.canvas.rerender()
    })
  }

  setTarget (target: IList) {
    this.target = target
    this.target.isTarget = true

    this.target.onSizeChange(() => {
      this.canvas.rerender()
    })
  }

  addEdge ({ source, target }: { source: IItem, target: IItem }) {
    if (!this.source || !this.target) throw new Error("source or target is undefined")

    const sourceIndex = this.source.getIndex(source)
    const targetIndex = this.target.getIndex(target)


    const line = Concat(this, new PathService());
    line.setData({ source: sourceIndex, target: targetIndex })
    this.canvas.paths.push(line)
  }

  remove ({ source, target }: { source: IItem, target: IItem }) {
    const index = this.canvas.paths.findIndex(it => (it.source === source && it.target === target))
    this.canvas.paths.splice(index, 1)
  }

}