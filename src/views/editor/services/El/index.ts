import Callback from "@/services/Callback"

/**
 * 管理Editor的输入框DOM节点
 */
export default class El {
  private el: HTMLElement | null = null

  setElCallbacks = new Callback<(el: HTMLElement) => void>()

  getEl (): HTMLElement {
    if (!this.el) {
      throw Error('El 为空')
    }
    return this.el
  }

  setEl (el: HTMLElement): void {
    this.el = el
    this.setElCallbacks.run(el)
  }

  onSetEl (fn: (el: HTMLElement) => void) {
    return this.setElCallbacks.add(fn)
  }

  private _isMounted = false

  mounted () {
    this._isMounted = true
  }

  /** 判断是否处于测试环境 */
  isMounted () {
    return this._isMounted
  }
}