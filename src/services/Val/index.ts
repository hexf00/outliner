export class Val<T> {
  declare data: T
  set (data: T) {
    this.data = data
  }

  get (): T {
    return this.data
  }
}