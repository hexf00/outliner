import { InjectRef, Service } from 'ioc-di';
import { IView } from '../../components/Line';
import { IPos, IRect, ISize } from '../../types';
import CanvasService from '../Canvas/service';
import Mapping from '../mapping';

@Service()
export default class LineService implements IView {

  @InjectRef(() => Mapping) mapping !: Mapping
  @InjectRef(() => CanvasService) canvas !: CanvasService

  source = 0
  target = 0

  setData ({ source, target }: { source: number, target: number }) {
    this.source = source
    this.target = target
    this.calc()
  }


  getY (index: number, list: { pos: IRect, itemSize: ISize, scrollTop: number }): number {
    const { y: oy, height: maxHeight } = list.pos
    const { height } = list.itemSize
    const scrollTop = list.scrollTop

    let y = oy + index * height + height / 2 - scrollTop
    if (y < oy) {
      y = oy
    } else if (y > oy + maxHeight) {
      y = oy + maxHeight
    }

    return y;
  }


  getSourcePos (index: number, list: { pos: IRect, itemSize: ISize, scrollTop: number }): IPos {
    const { x: ox } = list.pos
    const { width } = list.itemSize
    return {
      x: ox + width,
      y: this.getY(index, list)
    }
  }

  getTargetPos (index: number, list: { pos: IRect, itemSize: ISize, scrollTop: number }): IPos {
    const { x } = list.pos


    return {
      x: x,
      y: this.getY(index, list)
    }
  }

  calc () {
    console.count('calc')
    if (!this.mapping.source || !this.mapping.target) throw new Error("source or target is undefined")

    const { x: x1, y: y1 } = this.getSourcePos(this.source, this.mapping.source)
    const { x: x2, y: y2 } = this.getTargetPos(this.target, this.mapping.target)
    const { x, y } = this.canvas.pos

    this.x1 = x1 - x
    this.y1 = y1 - y
    this.x2 = x2 - x
    this.y2 = y2 - y
  }

  x1: number = 0
  y1: number = 0
  x2: number = 10
  y2: number = 10
}