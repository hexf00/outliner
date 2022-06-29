import { Component, Prop, Vue } from 'vue-property-decorator';

export interface IView {
  name: string
  submit (): void
  /** 错误信息 */
  msg: string
}
@Component
export default class Add extends Vue {
  declare $props: {
    service: IView
  }
  @Prop() service !: IView
  render () {
    const service = this.service

    return <div>
      <input type="text" v-model={service.name} />
      <button onClick={() => service.submit()}>Add</button>
      {service.msg && <div>{service.msg}</div>}
    </div>
  }
}
