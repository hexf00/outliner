import { Inject, InjectRef, Service } from "ioc-di"
import ContextMenuService from "../../ContextMenu/service"
import { IAtom } from "../../Editor"
import { EditorService } from "../../Editor/service"

/**
 * 自定义构建的range对象
 */
export interface IDataRange {
  /** 单元索引起始 */
  startIndex: number
  /** 单元索引结束 */
  endIndex: number
  /** 内容索引起始 */
  startOffset: number
  /** 内容索引结束 */
  endOffset: number
}

/**
 * 双链上下文菜单
 */
@Service()
export class DataRange implements IDataRange {
  @Inject(ContextMenuService) contextMenu!: ContextMenuService

  @InjectRef(() => EditorService) editor!: EditorService

  startIndex = 0
  endIndex = 0
  startOffset = 0
  endOffset = 0


  set (data: IDataRange) {
    this.startIndex = data.startIndex
    this.endIndex = data.endIndex
    this.startOffset = data.startOffset
    this.endOffset = data.endOffset

    // 现实和更新双链上下文菜单
    if (this.contextMenu.isShow) {
      const text = this.editor.getText(data)
      this.contextMenu.items[0].label = `创建[[${text}]]`
    } else {
      this.openContextMenu()
    }
  }

  /**
   * 显示双链上下文菜单
   */
  openContextMenu (): void {
    const text = this.editor.getText(this)
    this.contextMenu.show(this.getSelectionXy(), [
      {
        label: `创建[[${text}]]`,
        callback: () => {
          // 说明：此处需要实时获取
          const text = this.editor.getText(this);
          if (!text) {
            return
          }

          // console.log(' this.endOffset', this.endOffset)

          const replaceNodes: IAtom[] = [{
            type: "link",
            text
          }]

          //  TODO: 如果2个link相邻，需要在中间插入一个空白间隔，用于修复光标显示的bug
          // TODO:如果最后一个元素是link，也需要在后面插入一个空白间隔，用于修复光标显示的bug

          // if (
          //   this.editor.data.length === 0 ||
          //   (
          //     this.endOffset + 2 === this.editor.data[this.editor.data.length - 1].text.length
          //   )) {
          //   replaceNodes.push({ type: 'space', text: '' })
          // }

          //将选区替换为type:link
          this.editor.updateRange(this, replaceNodes)
          //销毁双链上下文菜单
          this.contextMenu.hide()
        }
      },
    ])
  }

  /**
   * 通过输入焦点计算双链上下文菜单的位置
   */
  getSelectionXy (): { x: number, y: number } {
    const range = window.getSelection()!.getRangeAt(0)
    const { x, y } = range.getBoundingClientRect()

    //26是随便设置的高度偏移
    return { x, y: y + 26 }
  }

}