import { InjectRef, Service } from 'ioc-di';

import { IView } from '../../components/Canvas';
import { IRect } from '../../types';
import Drag from '../Drag';
import PathService from '../Path/service';

@Service()
export default class CanvasService implements IView {
  paths: PathService[] = []
  @InjectRef(() => Drag) tip !: Drag

  el: Element | null = null

  setEl (el: Element) {
    this.el = el
  }

  pos: IRect = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  }

  /** 要想渲染 鼠标位置的偏移，需要获取实时数据 */
  getPosRealTime () {
    if (!this.el) throw Error('canvas el is null')
    return this.el.getBoundingClientRect()
  }

  setPos (pos: IRect) {
    this.pos = pos

    this.rerender()
  }

  // 改变排序后需要重新计算
  replaceIndex (oldIndex, newIndex) {
    this.paths.forEach(path => {
      let target
      if (path.target === oldIndex) {
        target = newIndex
      } else if (path.target === newIndex) {
        target = oldIndex
      }

      if (target !== undefined) {
        // 更新位置
        path.setData({ source: path.source, target })
      }
    })
  }

  rerender () {
    this.paths.forEach(path => {
      path.calc()
    })
  }
}