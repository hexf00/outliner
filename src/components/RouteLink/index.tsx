import { Component, Inject, Prop, Vue } from 'vue-property-decorator'
import RouterService from '../Router/service'

export interface IRouteLink {
  path: string
}

@Component
export default class RouteLink extends Vue {
  declare $props: {
    to: IRouteLink
  }
  @Prop() to !: IRouteLink

  @Inject('router') router!: RouterService

  render () {
    return <a href="javascript:;" onclick={() => this.router.to(this.to)}>
      {this.$slots.default}
    </a>
  }
}
