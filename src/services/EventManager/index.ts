import { Destroy, Service } from "ioc-di"

@Service()
export default class EventManager {
  private data = new Map<HTMLElement, Record<string, EventListener[]>>()
  add<K extends keyof HTMLElementEventMap> (el: HTMLElement, type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => void) {
    el.addEventListener(type, listener)
    if (!this.data.has(el)) {
      this.data.set(el, {})
    }
    const map = this.data.get(el)!
    const listeners = map[type] = map[type] || []
    listeners.push(listener as EventListener)
  }
  clear (el: HTMLElement) {
    const map = this.data.get(el)
    if (map) {
      for (const type in map) {
        map[type].forEach(listener => {
          el.removeEventListener(type, listener)
        })
        map[type] = []
      }
      this.data.delete(el)
    }
  }
  @Destroy
  destroy () {
    this.data.forEach((map, el) => {
      this.clear(el)
    })
  }
}