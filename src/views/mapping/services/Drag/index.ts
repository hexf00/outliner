import { Inject, InjectRef, Service } from "ioc-di"
import CanvasService from "../Canvas/service"
import Mapping from "../mapping"


@Service()
export default class Drag {
  @Inject(Mapping) mapping!: Mapping
  @InjectRef(() => CanvasService) canvas !: CanvasService


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


  getY (y: number) {
    const { y: oy } = this.canvas.getPosRealTime()
    return y - oy
  }

  start (e: DragEvent, source: any) {
    this.isDrag = true
    this.x1 = e.clientX
    this.y1 = this.getY(e.clientY)
    this.x2 = e.clientX
    this.y2 = this.getY(e.clientY)
    this.source = source
  }

  move (e: DragEvent) {
    if (!this.isDrag) return

    if (e.dataTransfer?.dropEffect === 'none' && e.clientX === 0 && e.clientY === 0) {
      //在屏幕外
      return
    }

    this.x2 = e.clientX
    this.y2 = this.getY(e.clientY)
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