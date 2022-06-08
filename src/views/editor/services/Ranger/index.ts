import { Inject, Service } from 'ioc-di';

import { nodeIndexOf } from '@/utils/dom/nodeIndexOf';

import Data from '../Data';
import El from '../El';

import type { IDataRange, IRange } from '../../types';
import { IAtom } from '../../Editor';
import { DomRange } from '../DomRange';
/** 将Range转换为DataRange */
@Service()
export default class Ranger {
  @Inject(Data) data!: Data
  @Inject(El) elManager!: El
  @Inject(DomRange) domRange!: DomRange

  isRoot (el) {
    return el === this.elManager.getEl()
  }

  getDataIndex (el: Node): number {
    // TODO: 暂时没有考虑到有样式的文本
    // 获取到lv1的索引
    // if (el.nodeType === 3/*** 文本节点 */) {
    // }

    return nodeIndexOf(this.elManager.getEl(), el)
  }

  /** 将浏览的选区转换为Data的选区 */
  toDataRange (range: IRange): IDataRange {

    if (this.isRoot(range.startContainer) && this.isRoot(range.endContainer)) {
      // lv 0
      return {
        startIndex: range.startOffset,
        endIndex: 0,
        startOffset: range.endOffset,
        endOffset: 0
      }
    } else {
      // lv n
      return {
        startIndex: this.getDataIndex(range.startContainer),
        endIndex: 0,
        startOffset: this.getDataIndex(range.endContainer),
        endOffset: 0
      }
    }

  }

  /** 操作数据，并更新选区 */
  updateByRange (dataRange: IDataRange, nodes: IAtom[]): void {
    const [nodeIndex, textIndex] = this.data.updateByRange(dataRange, nodes)
    this.domRange.setDomRange({ nodeIndex, textIndex })
  }
}