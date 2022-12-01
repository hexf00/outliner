import { Component, Prop, Vue } from 'vue-property-decorator'
import HomeService from './service'

@Component
export default class Home extends Vue {
  declare $props: {
    service: HomeService
  }
  @Prop() service !: HomeService
  render () {
    return <div>
      menu
    </div>
  }
}
