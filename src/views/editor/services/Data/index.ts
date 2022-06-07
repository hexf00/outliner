import { IAtom } from '../../Editor';

import type { IDataRange } from '../../types';

/** 编辑器数据结构 */
export default class Data {
  data: IAtom[] = []


  /** 操作数据，并返回新索引 */
  updateByRange (range: IDataRange, nodes: IAtom[]): number[] {
    console.log('updateRange', range.startIndex, range.endIndex)
    // this.data
    const startNode = this.data[range.startIndex]
    const endNode = this.data[range.endIndex]

    const leftNode = startNode ? { text: startNode.text.slice(0, range.startOffset - 2) } : null
    const rightNode = endNode ? { text: endNode.text.slice(range.endOffset + 2) } : null

    console.log(leftNode, rightNode)

    const left = this.data.slice(0, range.startIndex)
    const right = this.data.slice(range.endIndex + 1)

    const data = [
      ...left,
      ...(leftNode?.text ? [leftNode] : []),
      ...nodes,
      ...(rightNode?.text ? [rightNode] : []),
      ...right
    ]

    this.setData(data)

    // 新节点的索引
    const newIndex = left.length + (leftNode ? 1 : 0) + 1

    // TODO: 新节点的内容索引
    return [newIndex]
  }

  getData () {
    return this.data
  }

  setData (data: IAtom[]) {
    this.data = data
  }
}