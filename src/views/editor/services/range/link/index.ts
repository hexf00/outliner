import { Inject, Service } from 'ioc-di';

import { IAtom } from '@/views/editor/Editor';

import DataRange from '../data';
import DomRange from '../dom';


// TODO:改造这个类，它可能不是DataRange的派生
// 它应该是双链特性，linker ,包含 一个(link)Range+Menu

/**
 * 数据选区，双链菜单专属
 */
@Service()
export default class LinkRange extends DataRange {
  @Inject(DomRange) domRange!: DomRange

  getText () {
    return this.data.getText({
      startIndex: this.startIndex,
      endIndex: this.endIndex,
      startOffset: this.startOffset + 2,
      endOffset: this.endOffset - 2
    })
  }

  /** 操作数据，更新DOM选区 */
  replace (nodes: IAtom[]) {
    const newRange = super.replace(nodes)
    this.domRange.setByDataRange(newRange)


    // TODO:不需要返回
    return newRange
  }
}