import Callback from '@/services/Callback';
import { Inject, Service } from 'ioc-di';
import Drag from '../../services/Drag';
import { IRect, ISize } from "../../types";


@Service()
export default class ListService<T = string>  {
  @Inject(Drag) drag !: Drag

  data: T[] = []

  onSizeChangeCallbacks = new Callback()

  itemSize: ISize = {
    width: 10,
    height: 10,
  }

  pos: IRect = {
    x: 0,
    y: 0,
    width: 10,
    height: 10,
  }

  scrollTop = 0

  isSource = false

  isTarget = false

  setScrollTop (top: number) {
    this.scrollTop = top
    this.onSizeChangeCallbacks.run()
  }

  setItemSize (size: ISize): void {
    this.itemSize = size
    this.onSizeChangeCallbacks.run()
  }

  onSizeChange (fn: () => void) {
    return this.onSizeChangeCallbacks.add(fn)
  }

  setPos (pos: IRect) {
    this.pos = pos
    this.onSizeChangeCallbacks.run()
  }

  setData (data: T[]) {
    this.data = data
  }

  getIndex (item: T): number {
    return this.data.indexOf(item)
  }
}