import { Destroy, Inject, Service } from 'ioc-di';

import { IDataRange, IRange } from '@/views/editor/types';

import DomRange from '../dom';

/**
 * 管理当前的DomRange
 */
@Service()
export default class RangeManager {
  @Inject(DomRange) private domRange!: DomRange

  /** DOM range */
  private raw: IRange | undefined = undefined
  /** 数据 range */
  private data: IDataRange | undefined = undefined

  constructor () {
    this.initEvents()
  }

  getData () {
    return this.data
  }

  getRaw () {
    return this.raw
  }

  private _update: () => void = () => this.update()
  update () {
    this.raw = window.getSelection()?.getRangeAt(0)
    if (this.raw) {
      this.data = this.domRange.toDataRange(this.raw)
    } else {
      this.data = undefined
    }
  }

  private initEvents () {
    document.addEventListener('keyup', this._update)
    document.addEventListener('mouseup', this._update)
  }

  @Destroy
  destroy () {
    document.removeEventListener('keyup', this._update)
    document.removeEventListener('mouseup', this._update)
  }
}