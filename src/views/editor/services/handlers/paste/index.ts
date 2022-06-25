import { Service } from 'ioc-di';

import BaseHandler from '../base';

// 处理粘贴逻辑
@Service()
export default class Paste extends BaseHandler {
  onBeforeInput (e: InputEvent) {
    if (!(e.inputType === 'insertFromPaste')) return

    e.preventDefault()
    // TODO: 实现复制粘贴
  }

  onCompositionStart () { }
  onCompositionEnd () { }
}