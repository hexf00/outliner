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

  isRoot (el: Node) {
    return el === this.elManager.getEl()
  }

  getDataIndex ({ el, offset }: { el: Node, offset: number }): { index: number, offset: number } {
    // TODO: 暂时没有考虑到有样式的文本
    // 说明：对于有样式的文本，方案也是通过style来实现样式。
    // 获取到lv1的索引
    // if (el.nodeType === 3/*** 文本节点 */) {
    // }

    if (this.isRoot(el)) {
      return {
        index: offset,
        offset: 0
      }
    } else {

      /** 找到顶级El */
      let lv0El = el

      while (lv0El.parentNode !== this.elManager.getEl()) {
        lv0El = lv0El.parentNode!
      }

      const index = nodeIndexOf(this.elManager.getEl(), lv0El)
      return {
        index,
        offset
      }
    }
  }


  /** DOM选区转换为数据选区 */
  toDataRange (range: IRange): IDataRange {
    // if (this.isRoot(range.startContainer) && this.isRoot(range.endContainer)) {
    //   // lv 0
    //   return {
    //     startIndex: range.startOffset,
    //     startOffset: range.endOffset,
    //     endIndex: 0,
    //     endOffset: 0
    //   }
    // } else {
    // lv n

    const { index: startIndex, offset: startOffset } = this.getDataIndex({
      el: range.startContainer,
      offset: range.startOffset
    })

    const { index: endIndex, offset: endOffset } = this.getDataIndex({
      el: range.endContainer,
      offset: range.endOffset
    })


    return {
      startIndex,
      startOffset,
      endIndex,
      endOffset
    }
    // }
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

      if (spanEl.nodeType === 3 /** 是不是一个文本节点 */) {
        return [spanEl, offset]
      } else if ((spanEl as HTMLElement).dataset.type === 'text') {
        //获取文本节点的dom容器
        return [spanEl.childNodes[0], offset]
      } else {
        // throw new Error('未实现')
        return [el, index]
      }
    }

    const [startContainer, startOffset] = getEl(startIndex, start)
    const [endContainer, endOffset] = getEl(endIndex, end)
    const result = {
      startContainer,
      endContainer,
      startOffset,
      endOffset
    }

    console.warn('toDomRange', JSON.stringify(arguments[0]), {
      startContainer,
      endContainer,
      startOffset,
      endOffset
    })
    return result
  }



  /** 将输入焦点移动到新的位置 */
  setByDataRange (range: IDataRange) {
    // 没挂载不执行，如测试环境
    if (!this.elManager.isMounted()) return


    // 需要等待渲染完成
    Vue.nextTick(() => {
      const selection = window.getSelection()
      const domRange = this.toDomRange(range)
      selection?.setBaseAndExtent(domRange.startContainer, domRange.startOffset, domRange.endContainer, domRange.endOffset)
    })
  }
}