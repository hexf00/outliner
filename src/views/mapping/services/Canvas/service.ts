import { InjectRef, Service } from 'ioc-di';

import { IView } from '../../components/Canvas';
import { IRect } from '../../types';
import Drag from '../Drag';
import LineService from '../Line/service';

@Service()
export default class CanvasService implements IView {
  paths: LineService[] = []
  @InjectRef(() => Drag) tip !: Drag

  pos: IRect = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
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