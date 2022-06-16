import { InjectRef, Service } from 'ioc-di';
import { IView } from '../../components/Path';
import { IPos, IRect, ISize } from '../../types';
import CanvasService from '../Canvas/service';
import Mapping from '../mapping';

@Service()
export default class PathService implements IView {

  @InjectRef(() => Mapping) mapping !: Mapping
  @InjectRef(() => CanvasService) canvas !: CanvasService

  source = 0
  target = 0

  isSeeSource = true
  isSeeTarget = true

  setData ({ source, target }: { source: number, target: number }) {
    this.source = source
    this.target = target
    this.calc()
  }


  remove () {
    // const source = this.mapping.source?.data[this.source]
    // const target = this.mapping.target?.data[this.target]

    const index = this.canvas.paths.indexOf(this)

    //.findIndex(it => (it.source === source && it.target === target))
    this.canvas.paths.splice(index, 1)

    // if (!source || !target) {
    //   throw Error('线段数据异常')
    // }
    // this.mapping.remove({ source, target })
  }

  getY (index: number, list: { pos: IRect, itemSize: ISize, scrollTop: number }): { y: number, isSee: boolean } {
    const { y: oy, height: maxHeight } = list.pos
    const { height } = list.itemSize
    const scrollTop = list.scrollTop

    let y = oy + index * height + height / 2 - scrollTop
    let isSee = true
    if (y < oy) {
      y = oy
      isSee = false
    } else if (y > oy + maxHeight) {
      y = oy + maxHeight
      isSee = false
    }

    return { y, isSee };
  }


  getSourcePos (index: number, list: { pos: IRect, itemSize: ISize, scrollTop: number }): IPos & { isSee: boolean } {
    const { x: ox } = list.pos
    const { width } = list.itemSize
    return {
      x: ox + width,
      ...this.getY(index, list)
    }
  }

  getTargetPos (index: number, list: { pos: IRect, itemSize: ISize, scrollTop: number }): IPos & { isSee: boolean } {
    const { x } = list.pos


    return {
      x: x,
      ...this.getY(index, list)
    }
  }

  calc () {
    console.count('calc')
    if (!this.mapping.source || !this.mapping.target) throw new Error("source or target is undefined")

    const { x: x1, y: y1, isSee: isSeeSource } = this.getSourcePos(this.source, this.mapping.source)
    const { x: x2, y: y2, isSee: isSeeTarget } = this.getTargetPos(this.target, this.mapping.target)
    const { x, y } = this.canvas.pos

    this.x1 = x1 - x
    this.y1 = y1 - y
    this.x2 = x2 - x
    this.y2 = y2 - y
    this.isSeeSource = isSeeSource
    this.isSeeTarget = isSeeTarget
  }

  x1: number = 0
  y1: number = 0
  x2: number = 10
  y2: number = 10
}