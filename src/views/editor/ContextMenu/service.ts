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

  hide () {
    this.isShow = false
    document.removeEventListener('keydown', this.keydownHandle)
  }

  show ({ x, y }: { x: number, y: number }, items: IItem[]) {
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


    //避免上下文丢失
    this.keydownHandle = (e: KeyboardEvent) => this.keydown(e)
    const hide = () => {
      this.hide()
      document.removeEventListener('click', hide)
    }
    window.addEventListener('click', hide)
    document.addEventListener('keydown', this.keydownHandle)
  }

  //单纯是记录引用
  keydownHandle = (e: KeyboardEvent) => { }
  keydown (e: KeyboardEvent) {
    console.log('keydown', e.key, this.activeItem)

    if (e.key === 'Enter' && this.activeItem) {
      this.activeItem.callback?.()
    }
  }

  @Destroy
  destroy () {
    this.items = []
  }
}
