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

  /** 从一个空的div输入需要特殊处理，不能让浏览器改变dom */
  firstInput (data: string) {
    // 不能存储对象，因为对象会被改变
    const { anchorNode, focusNode } = window.getSelection()!
    this.data.push({ text: data })

    //渲染后恢复选区，可与setTimeout替换
    Vue.nextTick(() => {
      // 写死为1
      window.getSelection()?.setBaseAndExtent(
        anchorNode!, 1, focusNode!, 1
      )
    })
  }

  beforeInput (e: InputEvent): void {
    const el = e.target as HTMLElement

    if (['insertFromPaste' /** 粘贴 */,
      'deleteByDrag' /** 拖拽删除 */,
      'insertFromDrop' /** 拖拽插入 */]
      .includes(e.inputType)) {
      // 这些交互会改变dom，导致render异常所以屏蔽
      // 如果需要以后再额外实现

      e.stopPropagation()
      e.preventDefault()

    } else if (el.textContent === '' && e.data) {
      // 输入第一个字符，阻止默认行为，会改变dom元素，导致渲染效果异常
      e.stopPropagation()
      e.preventDefault()
      this.firstInput(e.data)
    }
  }

  /** 记录和恢复选取 */
  warpSelection (fn: () => void) {
    // 不能存储对象，因为对象会被改变
    const { anchorNode, anchorOffset, focusNode, focusOffset } = window.getSelection()!

    fn()

    //渲染后恢复选区，可与setTimeout替换
    Vue.nextTick(() => {
      window.getSelection()?.setBaseAndExtent(
        anchorNode!, anchorOffset, focusNode!, focusOffset
      )
    })
  }


  //说明：这里偷懒使用dom来生成全新的ast，实际可以在beforeInput内处理完成
  input (e: InputEvent): void {
    console.log('input', e)
    e.stopPropagation()
    e.preventDefault()

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

    this.warpSelection(() => this.data = result)
  }

}