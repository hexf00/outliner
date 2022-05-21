import { Component, Prop, Vue } from 'vue-property-decorator'

export interface ISheet {
  init (el: HTMLIFrameElement): void
}
@Component
export default class Sheet extends Vue {
  declare $el: HTMLIFrameElement
  declare $props: {
    service: ISheet
  }
  @Prop() service !: ISheet

  mounted () {
    this.service.init(this.$el)
  }
  render () {
    return <iframe style="height:100%;width:100%;border:none;"></iframe>
  }
}
