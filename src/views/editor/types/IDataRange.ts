/**
 * 自定义构建的range对象
 */

export interface IDataRange {
  /** 单元索引起始 */
  startIndex: number;
  /** 单元索引结束 */
  endIndex: number;
  /** 内容索引起始 */
  startOffset: number;
  /** 内容索引结束 */
  endOffset: number;
}
