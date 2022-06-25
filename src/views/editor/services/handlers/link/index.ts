import { Concat, Service } from "ioc-di";
import BaseHandler from "../base";
import DataRange from "../../range/data";

/** 双链语法 */
@Service()
export default class Link extends BaseHandler {

  onBeforeInput (e: InputEvent) {
    //1. 未选中时，自动补全]
    //2. TODO: 选中时，自动不全]
    if (!(e.inputType === 'insertText')) return

    e.preventDefault()

    const range = Concat(this, new DataRange())
    range.setData(this.ranger.getData()!)

    if (e.data === '[') {
      const dataRange = range.replace([{ text: '[]' }])
      this.domRange.setByDataRange({
        ...dataRange,
        // 说明：括号自动补全，光标需要偏移
        startOffset: dataRange.endOffset - 1,
        endOffset: dataRange.endOffset - 1
      })
    } else {
      const dataRange = range.replace([{ text: e.data || '' }])
      this.domRange.setByDataRange(dataRange)
    }

    // input事件内判断是否要显示双链菜单
    this.elManager.getEl().dispatchEvent(new Event('input'))
  }

  onCompositionStart (e: CompositionEvent) { }

  onCompositionEnd (e: CompositionEvent) { }
}