import { Component, Prop, Vue } from 'vue-property-decorator'
export interface IView {
  content: string
  setContent (content: string): void
}

@Component
export default class DivInput extends Vue {
  declare $props: {
    service: IView
  }

  @Prop() service !: IView

  render () {
    const service = this.service
    return <div contentEditable onblur={(e: Event) => service.setContent((e.target as HTMLElement).innerText)}>
      {service.content}
    </div>
  }
}