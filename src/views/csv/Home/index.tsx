import { Component, Prop, Vue } from 'vue-property-decorator'
import HomeService from './service'
import CSV from '../CSV'
import Nav from '../../components/Nav'

@Component
export default class Home extends Vue {
  declare $props: {
    service: HomeService
  }
  @Prop() service !: HomeService
  render () {
    return <div>
      <Nav />
      <CSV service={this.service.csv} />
    </div>
  }
}
