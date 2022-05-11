import { IEditor, IAtom } from './index'
import style from './index.module.scss'
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

    const childNodes = (e.target as HTMLElement).childNodes

    const result: IAtom[] = []
    for (let index = 0; index < childNodes.length; index++) {
      const el = childNodes[index]
      if (el.nodeType === 3/** text */) {
        if (el.textContent) {
          const last = result[result.length - 1]
          // 如果上一个是文本，则合并
          if (last && last.type === undefined) {
            last.text += el.textContent
          } else {
            el.textContent && result.push({ text: el.textContent })
          }
        }
      } else {
        el.textContent && result.push({ type: 'link', text: el.textContent })
      }
    }
    this.data = result
  }
}