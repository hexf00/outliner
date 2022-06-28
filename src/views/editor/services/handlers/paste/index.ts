import { Concat, Service } from 'ioc-di';
import DataRange from '../../range/data';

import BaseHandler from '../base';

// 处理粘贴逻辑
@Service()
export default class Paste extends BaseHandler {
  onBeforeInput (e: InputEvent) {
    if (!(e.inputType === 'insertFromPaste')) return
    e.preventDefault()
  }

  onPaste (e: ClipboardEvent) {
    const data = e.clipboardData?.getData("text/plain")
    if (data === undefined) return

    const range = Concat(this, new DataRange())
    range.setData(this.ranger.getData()!)

    this.domRange.setByDataRange(range.replace([{ text: data.replace(/\n/g, '') }]))

    // input事件内判断是否要显示双链菜单
    this.elManager.getEl().dispatchEvent(new Event('input'))
  }

  onCompositionStart () { }
  onCompositionEnd () { }
}