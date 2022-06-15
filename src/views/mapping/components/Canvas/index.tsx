import { Component, Prop, Vue } from 'vue-property-decorator'
import { IRect } from '../../types'
import Path, * as NPath from '../Path'

export interface IView {
  paths: NPath.IView[]
  tip: NPath.IView & { isShow: boolean }
  setPos (pos: IRect): void
}

@Component
export default class Canvas extends Vue {
  declare $props: {
    service: IView
  }
  @Prop() service !: IView

  mounted () {
    this.service.setPos(this.$el.getBoundingClientRect())
  }

  render () {
    return <svg version="1.1" xmlns="http://www.w3.org/2000/svg">
      {this.service.paths.map((it, index) => <Path service={it} />)}
      <Path v-show={this.service.tip.isShow} service={this.service.tip} />
    </svg >
  }
}
