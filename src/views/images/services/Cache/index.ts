import { get, set } from "idb-keyval"
export default class Cache {
  key: string = ''

  setKey (key: string) {
    this.key = key
  }

  get () {
    if (!this.key) throw Error('key 不存在')
    return get(this.key)
  }

  set (val: any) {
    if (!this.key) throw Error('key 不存在')
    return set(this.key, val)
  }
}