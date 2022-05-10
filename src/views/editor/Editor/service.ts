import { IEditor, IAtom } from './index'
import style from './index.module.scss'
export class EditorService implements IEditor {

  msg = '富文本编辑器'

  data = [
    { text: "123" },
    { type: "link" as const, text: "tag" },
    { text: "456" },
  ]

  html = this.encode(this.data)

  //实现二  直接改ast
  beforeInput (e: InputEvent): void {
    e.stopPropagation()
    e.preventDefault()

    console.log('beforeInput', e)
  }


  // 实现一  html->ast
  // 存在问题: vue不会对dom操作多出的元素进行diff，会出现重复的元素
  // 触发动作包括： 拖拽link元素、复制link粘贴元素
  // 解决思路：innerHTML不能使用vue渲染 
  // 实测使用拼接innerHTML 拖拽（deleteByDrag、insertFromDrop）彻底工作异常，复制粘贴工作正常
  input (e: InputEvent): void {
    console.log('input', e)
    e.stopPropagation()
    e.preventDefault()

    const childNodes = (e.target as HTMLElement).childNodes

    const result: IAtom[] = []
    for (let index = 0; index < childNodes.length; index++) {
      const el = childNodes[index]
      if (el.nodeType === 3/** text */) {
        console.log(el.textContent)
        el.textContent && result.push({ text: el.textContent })
      } else {
        console.log(el.textContent)
        el.textContent && result.push({ type: 'link', text: el.textContent })
      }
    }
    this.data = result
    this.html = this.encode(result)
  }

  encode (data: IAtom[]): string {
    return data.map(it => {
      if (it.type === 'link') {
        return `<div class=${style.link} contentEditable="false">${it.text}</div>`
      } else {
        return it.text
      }
    }).join('')
  }
}