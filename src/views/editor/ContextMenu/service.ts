import { Destroy } from 'ioc-di'
import { IItem, IView } from '.'


export default class ContextMenuService implements IView {
  isShow = false

  items: IItem[] = []

  pos = { top: '0px', left: '0px' }

  itemClick (it: IItem): void {
    if (it.children?.length) {
      this.switchExpand(it)
    } else if (it.callback) {
      if (it.isDisabled) return

      it.callback()
      this.hide()
    }
  }

  switchExpand (it: IItem): void {
    it.isExpand = !it.isExpand
  }

  hide () {
    this.isShow = false
  }

  show ({ x, y }: { x: number, y: number }, items: IItem[]) {
    this.isShow = true
    this.items = items
    this.pos = { left: x + 'px', top: y + 'px' }

    const hide = () => {
      this.hide()
      document.removeEventListener('click', hide)
    }
    window.addEventListener('click', hide)
  }

  @Destroy
  destroy () {
    this.items = []
  }
}
