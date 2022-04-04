/**
 * 提供事件回调注入
 */
export default class Callback {
  callbacks: (() => void)[] = []

  /** 注入或绑定事件动作 */
  add (cb: () => void) {
    this.callbacks.push(cb)
  }

  /** 注销事件，按需使用 */
  remove (cb: () => void) {
    const index = this.callbacks.indexOf(cb)
    if (index > -1) {
      this.callbacks.splice(index, 1)
    }
  }

  /** 触发 */
  run () {
    this.callbacks.forEach(fn => fn())
  }

  destroy () {
    this.callbacks = []
  }
}
