/**
 * 提供事件回调注入
 */
export default class Callback<T extends (...args: any[]) => void = () => void> {
  callbacks: (T)[] = []

  /** 注入或绑定事件动作 */
  add (cb: T) {
    this.callbacks.push(cb)
    return () => {
      this.remove(cb)
      cb = null!// gc
    }
  }

  /** 注销事件，按需使用 */
  remove (cb: T) {
    const index = this.callbacks.indexOf(cb)
    if (index > -1) {
      this.callbacks.splice(index, 1)
    }
  }

  /** 触发 */
  run (...args: Parameters<T>) {
    this.callbacks.forEach(fn => fn(...args))
  }

  destroy () {
    this.callbacks = []
  }
}
