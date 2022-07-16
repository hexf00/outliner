import { Component, Prop, Vue } from 'vue-property-decorator'

export interface IView {
  mount (el: HTMLElement): void
}

@Component
export default class Map extends Vue {
  declare $props: {
    service: IView
  }
  @Prop() service !: IView

  mounted () {
    this.service.mount(this.$el as HTMLElement)
  }

  render () {
    return <div>

    </div>
  }
}
