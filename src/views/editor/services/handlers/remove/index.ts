import { Concat, Service } from "ioc-di";
import BaseHandler from "../base";
import DataRange from "../../range/data";

/** 删除实现 */
@Service()
export default class Remove extends BaseHandler {

  onBeforeInput (e: InputEvent) {
    if (!(e.inputType === 'deleteContentBackward'/** 退格键 */
      || e.inputType === 'deleteContentForward'/** 删除键 */)) return

    e.preventDefault()

    // const raw = this.ranger.getRaw()

    const range = Concat(this, new DataRange())
    range.setData(this.ranger.getData()!)



    const dataRange = range.remove(e.inputType)
    this.domRange.setByDataRange(dataRange)



    // if (raw?.collapsed === false /** 区域 */) {

    // }


    return

    // // return



    // //删除字符时，如果是左括号，则删除右括号

    // const { startContainer, startOffset, endContainer, endOffset } = window.getSelection()!.getRangeAt(0)

    // // TODO: 依然需要重新实现删除逻辑
    // // console.log('deleteContentBackward', window.getSelection()!.getRangeAt(0))
    // // 如果是单个字符
    // if (this.isRoot(startContainer)) {
    //   //删除了link
    //   console.log('删除了link')
    // } else if (startContainer === endContainer && startOffset === endOffset) {
    //   //text中删除，有一种情况是text存在，但是是为了删除前面的元素
    //   // console.log(startContainer, startOffset)

    //   if (startOffset === 0 /** 目的是删除上一个元素，让浏览器默认行为处理 */) {
    //     return
    //   }


    //   const startIndex = this.domRange.getDataIndex(startContainer)
    //   if (startIndex === -1) throw Error('未能找到start节点')
    //   const [before, after] = splitOffset(this.data[startIndex].text, startOffset)

    //   e.stopPropagation()
    //   e.preventDefault()

    //   //如果左括号和右括号
    //   if (before[before.length - 1] === '[' && after[0] === ']') {
    //     this.data[startIndex].text = before.slice(0, before.length - 1) + after.slice(1)
    //   } else {
    //     //只需要删除前面的字符即可
    //     this.data[startIndex].text = before.slice(0, before.length - 1) + after
    //   }

    //   // 渲染后需要更新选取
    //   Vue.nextTick(() => {
    //     window.getSelection()?.setBaseAndExtent(
    //       startContainer!, startOffset - 1, startContainer!, startOffset - 1
    //     )
    //     el.dispatchEvent(new Event('input'))
    //   })
    // }

  }

  onCompositionStart () { }
  onCompositionEnd () { }
}