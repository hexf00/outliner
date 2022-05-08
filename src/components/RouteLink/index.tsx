import { Component, Prop, Vue } from 'vue-property-decorator'
import { to } from './service'

export interface IRouteLink {
  path: string
}

@Component
export default class RouteLink extends Vue {
  declare $props: {
    to: IRouteLink
  }
  @Prop() to !: IRouteLink

  render () {
    return <a href="javascript:;" onclick={() => to(this.to)}>
      {this.$slots.default}
    </a>
  }
}
