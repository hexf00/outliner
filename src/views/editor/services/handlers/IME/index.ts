import { Concat, Service } from "ioc-di";
import BaseHandler from "../base";
import DataRange from "../../range/data";

/** 双链语法 */
@Service()
export default class IME extends BaseHandler {
  onBeforeInput (e: InputEvent) { }

  /** 缓存IME输入事件触发前的选区 */
  range = Concat(this, new DataRange())

  onCompositionStart (e: CompositionEvent) {
    this.range.setData(this.ranger.getData()!)
  }

  onCompositionEnd (e: CompositionEvent) {
    // const range = this.ranger.getData()!

    //通过撤销来恢复DOM
    document.execCommand('undo')

    // this.range.setData({
    //   startIndex: this.range.startIndex,
    //   startOffset: this.range.startOffset,
    //   endIndex: range.endIndex,
    //   endOffset: range.endOffset
    // })

    this.domRange.setByDataRange(this.range.replace([{ text: e.data || '' }]))

    // input事件内判断是否要显示双链菜单
    this.elManager.getEl().dispatchEvent(new Event('input'))
  }
}