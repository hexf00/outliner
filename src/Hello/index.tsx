import { Component, Prop, Vue } from 'vue-property-decorator'
import { HelloService } from './service'
import style from './index.module.scss'
@Component
export default class Hello extends Vue {
  @Prop() service !: HelloService
  render () {
    return <div class={style.red}>
      hello: {this.service.message}
    </div>
  }
}
