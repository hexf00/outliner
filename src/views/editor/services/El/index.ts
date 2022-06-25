import Callback from "@/services/Callback"

/**
 * 管理Editor的输入框DOM节点
 */
export default class El {
  private el: HTMLElement | null = null

  mountedCallbacks = new Callback<(el: HTMLElement) => void>()

  getEl (): HTMLElement {
    if (!this.el) {
      throw Error('El 为空')
    }
    return this.el
  }

  mount (el: HTMLElement): void {
    this.el = el
    this.mountedCallbacks.run(el)
  }

  unmount (): void {
    this.el = null
  }


  onMounted (fn: (el: HTMLElement) => void) {
    return this.mountedCallbacks.add(fn)
  }

  /** 判断是否处于测试环境 */
  isMounted () {
    return this.el
  }
}