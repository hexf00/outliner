import { Concat, Inject, InjectRef, Service } from 'ioc-di';

import { IRect, ISize } from '../../types';
import CanvasService from '../Canvas/service';
import Drag from '../Drag';
import PathService from '../Path/service';

type IItem = unknown
type IEdge = { source: IItem, target: IItem }
interface IList {
  data: IItem[];
  isSource: boolean;
  isTarget: boolean;
  pos: IRect;
  itemSize: ISize;
  scrollTop: number;
  getIndex (item: IItem): number;
  onSizeChange (fn: () => void): void;
}

@Service()
export default class Mapping {
  @InjectRef(() => Drag) drag !: Drag
  @Inject(CanvasService) canvas !: CanvasService

  target: IList | undefined
  source: IList | undefined

  isEnable = true

  setSource (source: IList) {
    this.source = source
    this.source.isSource = true

    this.source.onSizeChange(() => {
      this.canvas.rerender()
    })
  }

  setTarget (target: IList) {
    this.target = target
    this.target.isTarget = true

    this.target.onSizeChange(() => {
      this.canvas.rerender()
    })
  }

  addEdge ({ source, target }: IEdge) {
    if (!this.source || !this.target) throw new Error("source or target is undefined")

    const sourceIndex = this.source.getIndex(source)
    const targetIndex = this.target.getIndex(target)


    const line = Concat(this, new PathService());
    line.setData({ source: sourceIndex, target: targetIndex })
    this.canvas.paths.push(line)
  }

  setData (data: IEdge[]) {
    this.canvas.paths = []
    data.forEach(it => {
      this.addEdge(it)
    })
  }

  getData () {
    return this.canvas.paths.map(it => ({ source: it.source, target: it.target }))
  }

  remove ({ source, target }: { source: IItem, target: IItem }) {
    const index = this.canvas.paths.findIndex(it => (it.source === source && it.target === target))
    this.canvas.paths.splice(index, 1)
  }

  enable () {
    this.isEnable = true
    this.drag.enable()
  }

  disable () {
    this.isEnable = false
    this.drag.disable()
  }
}