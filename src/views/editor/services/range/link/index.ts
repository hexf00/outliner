import { Inject, Service } from 'ioc-di';

import { IAtom } from '@/views/editor/Editor';

import DataRange from '../data';
import DomRange from '../dom';

/**
 * 数据选区，双链菜单专属
 */
@Service()
export default class LinkRange extends DataRange {
  @Inject(DomRange) domRange!: DomRange

  /** 操作数据，更新DOM选区 */
  replace (nodes: IAtom[]) {
    const [nodeIndex, textIndex] = super.replace(nodes)
    this.domRange.setDomRange({ nodeIndex, textIndex })

    return [nodeIndex, textIndex]
  }
}