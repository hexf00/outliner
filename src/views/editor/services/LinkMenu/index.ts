import { Inject, Service } from "ioc-di";
import ContextMenuService from "../../ContextMenu/service";
import { IAtom } from "../../Editor";
import Data from "../Data";
import LinkRange from "../range/link";


/** 双链上下文菜单 */
@Service()
export default class LinkMenu {
  contextMenu = new ContextMenuService()
  @Inject(Data) data!: Data
  @Inject(LinkRange) linkRange !: LinkRange

  /**
   * 显示双链上下文菜单
   */
  openContextMenu (): void {
    const text = this.data.getText(this.linkRange)

    // 更新双链上下文菜单显示的文字
    if (this.contextMenu.isShow) {
      this.contextMenu.items[0].label = `创建[[${text}]]`
      return
    }

    // 显示菜单
    this.contextMenu.show(this.getSelectionXy(), [
      {
        label: `创建[[${text}]]`,
        callback: () => {
          // 说明：此处需要实时获取
          const text = this.data.getText(this.linkRange);
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
          this.linkRange.replace(replaceNodes)
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