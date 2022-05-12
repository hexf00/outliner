import { IDataRange } from './../services/DataRange/index';
import { Inject, Service } from 'ioc-di'
import { Vue } from 'vue-property-decorator'
import { nodeIndexOf } from '../../../utils/dom/nodeIndexOf'
import { insertAt } from '../../../utils/string/insertAt'
import { splitOffset } from '../../../utils/string/splitOffset'
import ContextMenuService from '../ContextMenu/service'
import { DataRange } from '../services/DataRange'
import { IEditor, IAtom } from './index'

@Service()
export class EditorService implements IEditor {
  @Inject(ContextMenuService) contextMenu!: ContextMenuService
  @Inject(DataRange) range!: DataRange

  msg = '富文本编辑器'

  data = [
    { text: "123" },
    { type: "link" as const, text: "tag" },
    { text: "456" },
  ]

  el: HTMLElement = document.createElement('div')

  /** 存储光标所在区域的双链区域对象 */
  @Inject(DataRange) linkRange!: DataRange

  /** 
   * 从一个空的div输入，或者光标位于顶级的不可编辑位置，需要特殊处理
   * 不能让浏览器改变dom
   * */
  firstInput (data: string, el: Node) {
    // 不能存储对象，因为对象会被改变
    this.data.push({ text: data })

    //渲染后恢复选区，可与setTimeout替换
    Vue.nextTick(() => {
      // 写死为1
      const lastChild = el.childNodes.item(el.childNodes.length - 1)
      window.getSelection()?.setBaseAndExtent(
        lastChild, 1, lastChild, 1
      )
      el.dispatchEvent(new Event('input'))
    })
  }


  hideContextMenu () {
    this.contextMenu.hide()
  }

  beforeInput (e: InputEvent): void {
    const el = e.target as HTMLElement

    console.log('beforeInput', e)
    const { startContainer } = window.getSelection()!.getRangeAt(0)
    if (['insertFromPaste' /** 粘贴 */,
      'deleteByDrag' /** 拖拽删除 */,
      'insertFromDrop' /** 拖拽插入 */,
      'insertParagraph' /** 插入换行 */]
      .includes(e.inputType)) {
      // 这些交互会改变dom，导致render异常所以屏蔽
      // 如果需要以后再额外实现

      e.stopPropagation()
      e.preventDefault()

    } else if (el === startContainer && e.data) {
      // 说明会创建一个的新的textNode
      // 输入第一个字符，阻止默认行为，会改变dom元素，导致渲染效果异常
      // 或者光标在顶级
      e.stopPropagation()
      e.preventDefault()

      //第一个被插入的[,也需要补全]
      this.firstInput(e.data === '[' ? '[]' : e.data, el)
    } else if (e.data === '[') {
      //1. 未选中时，自动补全]
      //2. 选中时，自动不全]

      e.stopPropagation()
      e.preventDefault()

      const { startContainer, startOffset, endContainer, endOffset } = window.getSelection()!.getRangeAt(0)

      // console.log(startContainer, startOffset, endContainer, endOffset)

      // 相同节点，需要加上`[`的字符长度
      const realEndOffset = startContainer === endContainer ? endOffset + 1 : endOffset

      const [startIndex, endIndex] = this.getSelectionDataIndex({ startContainer, endContainer }, el)
      // 插入左括号
      this.data[startIndex].text = insertAt(this.data[startIndex].text, startOffset, '[')
      // 插入右括号
      this.data[endIndex].text = insertAt(this.data[endIndex].text, realEndOffset, ']')

      // 渲染后需要更新选区
      Vue.nextTick(() => {
        window.getSelection()?.setBaseAndExtent(
          startContainer!, startOffset + 1, endContainer!, realEndOffset
        )
        el.dispatchEvent(new Event('input'))
      })
    } else if (e.inputType === 'deleteContentBackward') {
      // 说明：需要避免交互对dom的改动，比如说删除vue有记录的dom，则vue会按index删除

      //删除字符时，如果是左括号，则删除右括号

      const { startContainer, startOffset, endContainer, endOffset } = window.getSelection()!.getRangeAt(0)
      // 如果是单个字符
      if (this.isRoot(startContainer)) {
        //删除了link
        console.log('删除了link')
      } else if (startContainer === endContainer && startOffset === endOffset) {
        //text中删除，有一种情况是text存在，但是是为了删除前面的元素
        // console.log(startContainer, startOffset)

        if (startOffset === 0 /** 目的是删除上一个元素，让浏览器默认行为处理 */) {
          return
        }


        const startIndex = nodeIndexOf(el, startContainer)
        if (startIndex === -1) throw Error('未能找到start节点')
        const [before, after] = splitOffset(this.data[startIndex].text, startOffset)

        e.stopPropagation()
        e.preventDefault()

        //如果左括号和右括号
        if (before[before.length - 1] === '[' && after[0] === ']') {
          this.data[startIndex].text = before.slice(0, before.length - 1) + after.slice(1)
        } else {
          //只需要删除前面的字符即可
          this.data[startIndex].text = before.slice(0, before.length - 1) + after
        }

        // 渲染后需要更新选取
        Vue.nextTick(() => {
          window.getSelection()?.setBaseAndExtent(
            startContainer!, startOffset - 1, startContainer!, startOffset - 1
          )
          el.dispatchEvent(new Event('input'))
        })
      }
    }
  }

  /** 获取选区开头、结束在data对应的位置 */
  getSelectionDataIndex ({ startContainer, endContainer }: { startContainer: Node, endContainer: Node }, container: Node) {
    const startIndex = nodeIndexOf(container, startContainer)
    const endIndex = nodeIndexOf(container, endContainer)

    if (startIndex === -1) {
      console.error('startContainer', startContainer)
      throw Error('未能找到start节点')
    }
    if (endIndex === -1) {
      console.error('endContainer', endContainer)
      throw Error('未能找到end节点')
    }

    return [startIndex, endIndex]
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

  /** 如果焦点在根元素，有一些逻辑不一样 */
  isRoot (el: Node) {
    return this.el === el
  }

  /** 通过range获取文本 */
  getText ({ startIndex, startOffset, endIndex, endOffset }: IDataRange) {
    if (startIndex === endIndex) {
      if (startOffset === endOffset) {
        return ''
      } else {
        return this.data[startIndex].text.slice(startOffset, endOffset)
      }
    }

    let text = ''
    for (let index = startIndex; index <= endIndex; index++) {
      const item = this.data[index]
      if (index === startIndex) {
        text += item.text.slice(startOffset)
      } else if (index === endIndex) {
        text += item.text.slice(0, endOffset)
      } else {
        text += item.text
      }
    }
    return text
  }

  /** 输入光标是否在双链语法中 */
  isInLink (): boolean {

    // 判断光标是否位于[[]]中
    const { startContainer, startOffset, endContainer, endOffset } = window.getSelection()!.getRangeAt(0)
    if (this.isRoot(startContainer)) {
      console.log('startContainer 是 容器')
      return false
    }


    const [startIndex, endIndex] = this.getSelectionDataIndex({ startContainer, endContainer }, this.el)

    const centerText = this.getText({
      startIndex,
      startOffset,
      endIndex,
      endOffset
    })
    //往左找[[ , 不能有]]
    let leftFlag = false
    let leftStr = ''


    let leftIndex = 0
    let leftOffset = 0

    for (let i = startIndex; i > -1; i--) {
      const text = i === startIndex
        ? this.data[i].text.slice(0, startOffset)
        : this.data[i].text
      leftStr = text + leftStr

      const index = leftStr.lastIndexOf('[[')
      if (index !== -1) {
        leftStr = leftStr.slice(index + 2)
        //找到 [[ 标识，判断是否已有结尾
        leftFlag = leftStr.indexOf(']]') === -1
        if (leftFlag) {
          leftOffset = this.data[i].text.indexOf('[[') + 2
          leftIndex = i
        }
        break
      }
    }

    console.log('leftFlag', leftFlag)
    if (!leftFlag) {
      return false
    }

    //往右找]] , 不能有[[
    let rightFlag = false
    let rightStr = ''


    let rightIndex = 0
    let rightOffset = 0

    for (let i = endIndex, l = this.data.length; i < l; i++) {
      const text = i === endIndex
        ? this.data[i].text.slice(endOffset)
        : this.data[i].text
      rightStr += text



      const index = rightStr.indexOf(']]')
      if (index !== -1) {
        rightStr = rightStr.slice(0, index)
        //找到 ]] 标识，判断是否已有开头
        rightFlag = rightStr.indexOf('[[') === -1
        if (rightFlag) {
          rightOffset = this.data[i].text.indexOf(']]')
          rightIndex = i
        }
        break
      }
    }

    console.log('rightFlag', rightFlag)
    if (!rightFlag) {
      return false
    }



    console.log('innerText', leftStr, centerText, rightStr)
    console.log('innerText',
      leftIndex, leftOffset,
      rightIndex, rightOffset,
      this.getText({
        startIndex: leftIndex,
        startOffset: leftOffset,
        endIndex: rightIndex,
        endOffset: rightOffset
      }))

    //配置双链选区
    this.linkRange.set({
      startIndex: leftIndex,
      startOffset: leftOffset,
      endIndex: rightIndex,
      endOffset: rightOffset
    })

    return true
  }



  checkLinkMenu () {
    if (this.isInLink()) {
      //显示双链菜单的逻辑放入了DataRange中，DataRange相当于是胶水层
    } else {
      this.hideContextMenu()
    }
  }

  keydown (e: KeyboardEvent): void {
    // 改变焦点需要检查上下文菜单的展示状态
    // 此时光标还未变化，需要延迟下

    // console.log('keydown', e)

    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      // 禁止默认行为（光标改变到行首、行尾）
      e.preventDefault()
    }

    if (this.contextMenu.isShow) {
      setTimeout(() => {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
          this.checkLinkMenu()
        }
      })
    }
  }

  //说明：这里偷懒使用dom来生成全新的ast，实际可以在beforeInput内处理完成
  input (e: InputEvent): void {
    console.log('input', e)
    e.stopPropagation()
    e.preventDefault()

    this.warpSelection(() => {
      this.data = this.dom2ast(e.target as HTMLElement)
    })

    this.checkLinkMenu()
  }

}