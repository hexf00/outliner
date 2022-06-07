import { IAtom } from '../../Editor';

import type { IDataRange } from '../../types';

/** 编辑器数据结构 */
export default class Data {
  data: IAtom[] = []

  updateRange (range: IDataRange, nodes: IAtom[]) {

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


    // TODO: 在DataRange中实现
    // 将输入焦点移动到新的位置
    // const newIndex = left.length + (leftNode ? 1 : 0) + 1
    // Vue.nextTick(() => {
    //   const selection = window.getSelection()
    //   const el = this.elManger.getEl()
    //   selection?.setBaseAndExtent(el, newIndex, el, newIndex,)
    // })
  }

  getData () {
    return this.data
  }

  setData (data: IAtom[]) {
    this.data = data
  }
}