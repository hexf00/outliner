import { Inject, Service } from 'ioc-di';

import Data from '../../Data';

import type { IDataRange } from '../../../types';
import { IAtom } from '@/views/editor/Editor';

/**
 * 选区，基于数据
 */
@Service()
export default class DataRange implements IDataRange {
  @Inject(Data) protected data!: Data

  startIndex = 0
  startOffset = 0
  endIndex = 0
  endOffset = 0


  setData (data: IDataRange) {
    this.startIndex = data.startIndex
    this.startOffset = data.startOffset
    this.endIndex = data.endIndex
    this.endOffset = data.endOffset
  }

  /** 操作数据，不更新选区 */
  replace (nodes: IAtom[]) {
    return this.data.updateByRange(this, nodes)
  }

  /** 删除 */
  remove (type: 'deleteContentForward' | 'deleteContentBackward' = 'deleteContentBackward') {
    if (this.startIndex === this.endIndex && this.startOffset === this.endOffset /** 光标 */) {
      //计算出上一个字符的范围索引
      const prev = type === 'deleteContentBackward'
        ? this.data.getPrevPos({
          index: this.startIndex,
          offset: this.startOffset
        })
        : this.data.getNextPos({
          index: this.startIndex,
          offset: this.startOffset
        })

      return this.data.updateByRange({
        startIndex: prev.index,
        startOffset: prev.offset,
        endIndex: this.startIndex,
        endOffset: this.startOffset
      }, [])
    } else {
      //选区
      return this.data.updateByRange(this, [])
    }
  }
}