import { Component, Prop, Vue } from 'vue-property-decorator'

export interface IView {

}

@Component
export default class Home extends Vue {
  declare $props: {
    service: IView
  }
  @Prop() service !: IView
  render () {
    return <div>
      <div>123</div>
    </div>
  }
}
