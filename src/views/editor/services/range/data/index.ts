import { Inject, Service } from 'ioc-di';

import Data from '../../Data';

import type { IDataRange } from '../../../types';
import { IAtom } from '@/views/editor/Editor';

/**
 * 选区，基于数据
 */
@Service()
export default class DataRange implements IDataRange {
  @Inject(Data) data!: Data

  startIndex = 0
  endIndex = 0
  startOffset = 0
  endOffset = 0


  setData (data: IDataRange) {
    this.startIndex = data.startIndex
    this.endIndex = data.endIndex
    this.startOffset = data.startOffset
    this.endOffset = data.endOffset
  }

  /** 操作数据，不更新选区 */
  replace (nodes: IAtom[]) {
    return this.data.updateByRange(this, nodes)
  }
}