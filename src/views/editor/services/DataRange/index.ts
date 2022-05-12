import { Inject, InjectRef, Service } from "ioc-di"
import ContextMenuService from "../../ContextMenu/service"
import { EditorService } from "../../Editor/service"

/**
 * 自定义构建的range对象
 */
export interface IDataRange {
  startIndex: number
  endIndex: number
  startOffset: number
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
          //将选区替换为type:link
          this.editor.updateRange(this, {
            type: "link",
            //此处需要实时获取
            text: this.editor.getText(this)
          })
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