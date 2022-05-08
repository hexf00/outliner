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
    // @ts-ignore 此处无法准确识别异步组件，故排除
    return <active.component service={active.service} />
  }
}