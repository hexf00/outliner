import { Inject, InjectRef, Service } from "ioc-di"
import CanvasService from "../Canvas/service"
import Mapping from "../mapping"

type IItem = unknown

@Service()
export default class Drag {
  @Inject(Mapping) mapping!: Mapping
  @InjectRef(() => CanvasService) canvas !: CanvasService


  x1: number = 0
  y1: number = 0
  x2: number = 10
  y2: number = 10

  isSeeSource = true
  isSeeTarget = true

  get isShow () {
    return this.isDrag
  }
  isDrag = false

  source: IItem | null = null
  target: IItem | null = null


  getY (y: number) {
    const { y: oy } = this.canvas.getPosRealTime()
    return y - oy
  }

  start (e: DragEvent, source: unknown) {
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

  /** 拖拽结束 */
  drop (e: DragEvent, target) {
    if (this.isDrag === false) return
    this.mapping.addEdge({ source: this.source, target })
  }

  remove () {
    throw new Error("Method not implemented.")
  }
}