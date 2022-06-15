import { Service } from "ioc-di"
import ListService from "../../components/List/service"


@Service()
export default class Sort {

  x1: number = 0
  y1: number = 0
  x2: number = 10
  y2: number = 10

  list: ListService | null = null

  setList (list: ListService) {
    this.list = list
  }


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



}