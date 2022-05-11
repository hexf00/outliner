import { Inject, Service } from 'ioc-di'
import { Vue } from 'vue-property-decorator'
import { insertAtCursor } from '../../../utils/dom/insertAtCursor'
import ContextMenuService from '../ContextMenu/service'
import { IEditor, IAtom } from './index'
@Service()
export class EditorService implements IEditor {
  @Inject(ContextMenuService) contextMenu!: ContextMenuService

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

  openContextMenu ({ x, y }: { x: number, y: number }): void {
    this.contextMenu.show({ x, y }, [
      { label: '新建' },
    ])
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

  /** 偷懒做法，在input之后从dom生成最新的ast数据，要求不能改变dom结构才能正常工作 */
  dom2ast (dom: HTMLElement): IAtom[] {
    const childNodes = dom.childNodes
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
    return result
  }

  //说明：这里偷懒使用dom来生成全新的ast，实际可以在beforeInput内处理完成
  input (e: InputEvent): void {
    console.log('input', e)
    e.stopPropagation()
    e.preventDefault()



    this.warpSelection(() => {
      if (e.data === '[') {
        console.log(e.target)

        // 说明：这是一个过期的api，但是暂时能用
        document.execCommand('insertText', false, ']')

        // 会改变dom，导致渲染错乱，所以还是应该直接操作ast data
        // insertAtCursor(']')
      }
      this.data = this.dom2ast(e.target as HTMLElement)
    })



    // this.openContextMenu({ x: 100, y: 100 })
  }

}