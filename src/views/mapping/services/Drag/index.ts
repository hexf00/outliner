import { Inject, Service } from "ioc-di"
import Mapping from "../mapping"


@Service()
export default class Drag {
  @Inject(Mapping) mapping!: Mapping

  x1: number = 0
  y1: number = 0
  x2: number = 10
  y2: number = 10


  get isShow () {
    return this.isDrag
  }
  isDrag = false

  source: any = null
  target: any = null

  start (e: DragEvent, source: any) {
    this.isDrag = true
    this.x1 = e.clientX
    this.y1 = e.clientY
    this.source = source
  }

  move (e: DragEvent) {
    if (!this.isDrag) return

    if (e.dataTransfer?.dropEffect === 'none' && e.clientX === 0 && e.clientY === 0) {
      //在屏幕外
      return
    }

    this.x2 = e.clientX
    this.y2 = e.clientY
  }

  /** 结束拖拽 */
  end (e: DragEvent) {
    this.isDrag = false
  }

  drop (e: DragEvent, target) {
    if (this.isDrag === false) return
    console.log(e, e.dataTransfer!.getData('obj'))

    console.log(this.source, target)
    this.mapping.addEdge({ source: this.source, target })
  }

  remove () {
    throw new Error("Method not implemented.")
  }
}