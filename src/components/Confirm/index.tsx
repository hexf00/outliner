import { Component, Prop, Vue } from 'vue-property-decorator'
import $ from './index.module.scss'
import ConfirmService from './service'

export const confirm = (msg: string) => {
  return new Promise((resolve, reject) => {
    const confirm = new ConfirmService({ msg })

    confirm.success = () => {
      resolve(true)
      confirm.unmount()
    }
    confirm.cancel = () => {
      reject(false)
      confirm.unmount()
    }

    confirm.mount()
  })
}

export interface IView {
  msg: string
  success (): void
  cancel (): void
}

@Component
export default class Confirm extends Vue {
  declare $props: {
    service: IView
  }
  @Prop() service !: IView
  render () {
    return <div class={$.confirm}>
      <div class={$.msg}>{this.service.msg}</div>
      <div class={$.btn}>
        <button onclick={() => this.service.success()}>确定</button>
        <button onclick={() => this.service.cancel()}>取消</button>
      </div>
    </div>
  }
}
