import { Service } from 'ioc-di';

import BaseHandler from '../base';

// 文字拖拽交互
@Service()
export default class Drag extends BaseHandler {
  onBeforeInput (e: InputEvent) {
    if (!(e.inputType === 'deleteByDrag'/** 拖拽删除 */
      || e.inputType === 'insertFromDrop'/** 拖拽插入 */)) return

    e.preventDefault()
    // TODO:考虑是否以及如何实现文字拖拽交互
  }

  onCompositionStart () { }
  onCompositionEnd () { }
}