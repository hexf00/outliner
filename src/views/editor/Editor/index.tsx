import { Component, Prop, Vue } from 'vue-property-decorator'

export interface IEditor {
  msg: string
}

@Component
export default class Editor extends Vue {
  declare $props: {
    service: IEditor
  }

  @Prop() service !: IEditor

  render () {
    const service = this.service
    return (
      <div>
        {service.msg}
      </div>
    )
  }
}
