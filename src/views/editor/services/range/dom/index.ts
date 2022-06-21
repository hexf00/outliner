import { Inject, Service } from 'ioc-di';
import Vue from 'vue';

import { nodeIndexOf } from '@/utils/dom/nodeIndexOf';

import El from '../../El';

import type { IDataRange, IRange } from '@/views/editor/types';
@Service()
export default class DomRange {
  @Inject(El) elManager!: El

  // startIndex = 0
  // endIndex = 0
  // startOffset = 0
  // endOffset = 0

  isRoot (el) {
    return el === this.elManager.getEl()
  }

  getDataIndex (el: Node): number {
    // TODO: 暂时没有考虑到有样式的文本
    // 说明：对于有样式的文本，方案也是通过style来实现样式。
    // 获取到lv1的索引
    // if (el.nodeType === 3/*** 文本节点 */) {
    // }

    /** 找到顶级El */
    let lv0El = el

    while (lv0El.parentNode !== this.elManager.getEl()) {
      lv0El = lv0El.parentNode!
    }

    return nodeIndexOf(this.elManager.getEl(), lv0El)
  }


  /** 将浏览的选区转换为Data的选区 */
  toDataRange (range: IRange): IDataRange {
    console.log('range', range)
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
        endIndex: this.getDataIndex(range.endContainer),
        startOffset: range.startOffset,
        endOffset: range.endOffset
      }
    }
  }

  /**
   * 说明：该函数应该在选然后才能调用
   */
  toDomRange ({ startIndex, endIndex, startOffset: start, endOffset: end }: IDataRange): IRange {
    const el = this.elManager.getEl();

    const getEl = (index: number, offset: number): [Node, number] => {



      const spanEl = el.childNodes[index];
      if (!spanEl) {
        if (index === el.childNodes.length /** 位于末尾 */) {
          return [el, index]
        } else {
          throw new Error('index out of range')
        }
      }

      // 优先该逻辑
      if (offset === 0) {
        return [el, index]
      }

      if (spanEl.nodeType === 3) {
        return [spanEl, offset]
      } else {
        // throw new Error('未实现')
        return [el, index]
      }
    }

    const [startContainer, startOffset] = getEl(startIndex, start)
    const [endContainer, endOffset] = getEl(endIndex, end)

    return {
      startContainer,
      endContainer,
      startOffset,
      endOffset
    }
  }



  /** 将输入焦点移动到新的位置 */
  setByDataRange (range: IDataRange) {
    // 没挂载不执行，如测试环境
    if (!this.elManager.isMounted()) return

    // 需要等待渲染完成
    Vue.nextTick(() => {
      const selection = window.getSelection()
      const domRange = this.toDomRange(range)

      console.log('newDomRange', range, domRange)
      selection?.setBaseAndExtent(domRange.startContainer, domRange.startOffset, domRange.endContainer, domRange.endOffset)
    })
  }
}