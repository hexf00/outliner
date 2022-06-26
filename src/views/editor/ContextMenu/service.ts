import { Destroy } from 'ioc-di'
import { IItem, IView } from '.'


export default class ContextMenuService implements IView {
  isShow = false

  items: IItem[] = []

  pos = { top: '0px', left: '0px' }

  activeItem: IItem | null = null

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

  _remove: Function | null = null

  hide () {
    this.isShow = false
    this._remove?.()
  }

  show ({ x, y }: { x: number, y: number }, items: IItem[], el: Node = document) {
    this.isShow = true
    this.items = items.map((it, index) => {
      // 初始化属性，防止响应式丢失
      it.isActive = !!it.isActive
      return it
    })

    //默认激活按钮
    items[0].isActive = true
    this.activeItem = items[0]

    this.pos = { left: x + 'px', top: y + 'px' }


    const hide = () => {
      this.hide()
      document.removeEventListener('click', hide)
    }
    document.addEventListener('click', hide)

    const keydownHandle = (e: KeyboardEvent) => this.keydown(e)
    el.addEventListener('keydown', keydownHandle as EventListener)
    this._remove = () => el.removeEventListener('keydown', keydownHandle as EventListener)
  }

  keydown (e: KeyboardEvent) {
    console.log('keydown', e.key, this.activeItem)

    if (e.key === 'Enter' && this.activeItem) {
      this.activeItem.callback?.()

      e.preventDefault()
      e.stopPropagation()
    }
  }

  @Destroy
  destroy () {
    this.items = []
  }
}
