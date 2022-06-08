import { Inject, Service } from 'ioc-di';
import Vue from 'vue';
import El from '../El';


@Service()
export class DomRange {
  @Inject(El) elManager!: El

  // startIndex = 0
  // endIndex = 0
  // startOffset = 0
  // endOffset = 0

  /** 设置Dom的选区 */
  setDomRange ({ nodeIndex, textIndex }) {
    // 没挂载不执行，如测试环境
    if (!this.elManager.isMounted()) return

    // 将输入焦点移动到新的位置
    Vue.nextTick(() => {
      const selection = window.getSelection()
      const el = this.elManager.getEl()

      if (textIndex === undefined) {
        // 只需要设置节点的索引
        selection?.setBaseAndExtent(el, nodeIndex, el, nodeIndex)
      } else {
        // 需要设置节点的索引和文本的索引
        throw new Error('not implemented')
      }
    })
  }
}