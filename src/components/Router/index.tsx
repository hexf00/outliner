import { Component, Prop, Vue } from 'vue-property-decorator'
import { IRoute } from './service'

export interface IRouter {
  active: IRoute
}

@Component
export default class Router extends Vue {
  declare $props: {
    service: IRouter
  }
  @Prop() service !: IRouter
  render () {
    const { active } = this.service
    return <active.component service={active.service} />
  }
}