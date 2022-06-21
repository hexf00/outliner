import { IDataRange } from './../../types/IDataRange';
import { Inject, Service } from "ioc-di";
import DomRange from '../range/dom';

@Service()
export default class RangeLooker {

  @Inject(DomRange) domRange!: DomRange
  data: IDataRange | undefined = undefined
  constructor () {
    this.initEvents()
  }

  update () {

    const range = window.getSelection()?.getRangeAt(0)
    if (range) {
      this.data = this.domRange.toDataRange(range)
    } else {
      this.data = undefined
    }
  }

  initEvents () {
    document.addEventListener('keyup', () => {
      this.update()
    })

    document.addEventListener('mouseup', () => {
      this.update()
    })
  }
}