import { Component, Prop, Vue } from 'vue-property-decorator'
export interface IView {
  content: string
}

@Component
export default class Input extends Vue {
  declare $props: {
    service: IView
  }

  @Prop() service !: IView

  render () {
    const service = this.service
    return <input type="text" v-model={service.content} />
  }
}