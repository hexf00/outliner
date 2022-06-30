import Confirm, { IView } from '.';
export default class ConfirmService implements IView {
  msg: string = ''

  el: HTMLElement = document.createElement('div')

  constructor (data: { msg: string }) {
    this.msg = data.msg
  }

  success (): void {
    this.unmount()
  }

  cancel (): void {
    this.unmount()
  }

  mount (el = this.el) {
    document.body.appendChild(el)
    const c = new Confirm({
      propsData: {
        service: this
      }
    }).$mount(el)

    // 挂载后el会变
    this.el = c.$el as HTMLElement
  }

  unmount () {
    //从 body 中移除
    document.body.removeChild(this.el)
  }
}