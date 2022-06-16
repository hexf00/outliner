import { Destroy, Inject, Service } from 'ioc-di';

import CanvasService from '../Canvas/service';

type IItem = unknown
interface IList {
  data: IItem[];
  isSource: boolean;
  isTarget: boolean;
  getIndex (item: IItem): number;
  onSizeChange (fn: () => void): void;
}

@Service()
export default class Sort {

  @Inject(CanvasService) canvas !: CanvasService

  x1: number = 0
  y1: number = 0
  x2: number = 10
  y2: number = 10

  list: IList | null = null

  setList (list: IList) {
    this.list = list
  }


  get isShow () {
    return this.isSort
  }
  isSort = false

  source: IItem = null
  target: IItem = null

  start (e: DragEvent, source: IItem) {
    this.isSort = true
    this.x1 = e.clientX
    this.y1 = e.clientY
    this.source = source
  }

  move (e: DragEvent, target: IItem) {
    if (!this.isSort) return

    if (e.dataTransfer?.dropEffect === 'none' && e.clientX === 0 && e.clientY === 0) {
      //在屏幕外
      return
    }

    const newIndex = this.list!.getIndex(target)
    const oldIndex = this.list!.getIndex(this.source)

    if (newIndex === oldIndex) return
    // 改变数据排序
    this.list?.data.splice(newIndex, 0, this.list?.data.splice(oldIndex, 1)[0])
    // 改变绘制顺序
    this.canvas.replaceIndex(oldIndex, newIndex)
  }

  /** 结束拖拽 */
  end (e: DragEvent) {
    this.isSort = false
  }

  @Destroy
  destroy () {

  }
}