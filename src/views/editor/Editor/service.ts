import { Vue } from 'vue-property-decorator'
import Callback from '../../../services/Callback'
import { IEditor, IAtom } from './index'
export class EditorService implements IEditor {

  msg = '富文本编辑器'

  data = [
    { text: "123" },
    { type: "link" as const, text: "tag" },
    { text: "456" },
  ]

  beforeInput (e: InputEvent): void {
    if (['insertFromPaste' /** 粘贴 */,
      'deleteByDrag' /** 拖拽删除 */,
      'insertFromDrop' /** 拖拽插入 */]
      .includes(e.inputType)) {
      e.stopPropagation()
      e.preventDefault()

      // 这些交互会改变dom，导致render异常所以屏蔽
      // 如果需要以后再额外实现
    }
  }


  //说明：这里偷懒使用dom来生成全新的ast，实际可以在beforeInput内处理完成
  input (e: InputEvent): void {
    console.log('input', e)
    e.stopPropagation()
    e.preventDefault()

    // 不能存储对象，因为对象会被改变
    const { anchorNode, anchorOffset, focusNode, focusOffset } = window.getSelection()!

    // 在setTimeout中设置选取会导致光标闪烁，需要清除选区，nextTick中设置不会
    // window.getSelection()?.removeAllRanges()

    const childNodes = (e.target as HTMLElement).childNodes
    const result: IAtom[] = []
    for (let index = 0; index < childNodes.length; index++) {
      const el = childNodes[index]
      if (el.nodeType === 3/** text */) {
        if (el.textContent) {
          const last = result[result.length - 1]
          result.push({ text: el.textContent })
        }
      } else {
        el.textContent && result.push({ type: 'link', text: el.textContent })
      }
    }

    // hack:如果删除为空会空，浏览器插入了新的dom，导致展现异常
    if (result.length === 0) {
      result.push({ text: ' ' })
    }

    this.data = result

    //渲染后恢复选区，可与setTimeout替换
    Vue.nextTick(() => {
      window.getSelection()?.setBaseAndExtent(
        anchorNode!, anchorOffset, focusNode!, focusOffset
      )
    })
  }

}