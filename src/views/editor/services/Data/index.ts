import { IAtom } from '../../Editor';

import type { IDataRange } from '../../types';

/** 编辑器数据结构 */
export default class Data {
  data: IAtom[] = []

  /** 通过range获取文本 */
  getText ({ startIndex, startOffset, endIndex, endOffset }: IDataRange) {
    if (startIndex === endIndex) {
      if (startOffset === endOffset) {
        return ''
      } else {
        return this.data[startIndex].text.slice(startOffset, endOffset)
      }
    }

    let text = ''
    for (let index = startIndex; index <= endIndex; index++) {
      const item = this.data[index]
      if (index === startIndex) {
        text += item.text.slice(startOffset)
      } else if (index === endIndex) {
        text += item.text.slice(0, endOffset)
      } else {
        text += item.text
      }
    }
    return text
  }

  /** 操作数据，并返回新索引 */
  updateByRange (range: IDataRange, nodes: IAtom[]): IDataRange {
    console.warn('updateRange', JSON.stringify(range))

    const data = this.data


    // this.data
    const startNode = data[range.startIndex]
    const endNode = data[range.endIndex]

    const leftNode = startNode ? { text: startNode.text.slice(0, range.startOffset) } : null
    const rightNode = endNode ? { text: endNode.text.slice(range.endOffset) } : null



    const left: IAtom[] = [...data.slice(0, range.startIndex), ...(leftNode?.text ? [leftNode] : [])]
    const right: IAtom[] = [...(rightNode?.text ? [rightNode] : []), ...data.slice(range.endIndex + 1)]
    const center = nodes

    console.log(leftNode, rightNode)

    //判断首尾是否需要合并
    const leftLast = left.slice(-1)[0]
    const rightFirst = right[0]

    const centerLast = center.slice(-1)[0]
    const centerFirst = center[0]

    if (leftLast && !leftLast.type) {
      if (centerFirst && !centerFirst.type) {
        centerFirst.text = leftLast.text + centerFirst.text
        left.pop()
      }
    }


    if (rightFirst && !rightFirst.type) {
      if (centerLast && !centerLast.type) {
        centerLast.text = centerLast.text + rightFirst.text
        right.shift()
      }
    }

    const newData = [
      ...left,
      ...center,
      ...right
    ]

    this.setData(newData)

    // 新节点的索引

    let endIndex: number
    let endOffset: number


    // 原则：基于能不能编辑来决定如何展示
    if (centerLast?.type) {
      // 不可编辑，索引变成顶级
      endIndex = left.length + center.length
      endOffset = 0
    } else {
      // 可编辑，索引变成内部
      endIndex = left.length + center.length - 1
      endOffset = (centerLast?.text.length || 0) - (rightFirst?.text.length || 0)
    }

    return {
      endIndex,
      endOffset,
      //TODO:暂时没用到，如果用到可以进一步实现
      startIndex: endIndex,
      startOffset: endOffset,
    }
  }

  getPrevPos ({ index, offset }: { index: number, offset: number }) {
    const data = this.data

    if (offset === 0 /** 返回索引在上一个元素 */) {
      if (index > 0) {
        const prev = data[index - 1]!

        if (prev.type /** 需要整个删除 */) {
          return { index: index - 1, offset: 0 }
        } else {
          return { index: index - 1, offset: prev.text.length - 1 > 0 ? prev.text.length - 1 : 0 }
        }
      } else {
        // 到顶了
        return { index: 0, offset: 0 }
      }
    } else {
      const item = data[index]!
      if (item.type /** 需要整个删除 */) {
        console.warn('不应该出现这种情况', { index, offset })
        return { index: index, offset: 0 }
      } else {
        return { index, offset: offset - 1 }
      }
    }
  }

  getData () {
    return this.data
  }

  setData (data: IAtom[]) {
    this.data = data
  }
}