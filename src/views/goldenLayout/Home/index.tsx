import { Component, Prop, Vue } from 'vue-property-decorator'
import HomeService from './service'
import $ from './index.module.scss'
import classNames from 'classnames'

export interface IView {

}

@Component
export default class Home extends Vue {
  declare $props: {
    service: IView
  }

  @Prop() service!: IView

  render () {
    return (
      <div class={classNames($.box)}>
        goldenLayout
      </div>
    )
  }
}
