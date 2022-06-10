import { Component, Prop, Vue } from 'vue-property-decorator'

export interface IView {
  data: string[]
}

@Component
export default class List extends Vue {
  declare $props: {
    service: IView
  }
  @Prop() service !: IView

  render () {
    return <div>
      {
        this.service.data.map((it, index) => (
          <div key={index}>{it}</div>
        ))
      }
    </div>
  }
}
