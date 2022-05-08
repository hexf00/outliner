import { Component, Prop, Vue } from 'vue-property-decorator'
import Outliner from '../../../Outliner'
import HomeService from './service'
import Nav from '../../Nav'

@Component
export default class Home extends Vue {
  declare $props: {
    service: HomeService
  }
  @Prop() service !: HomeService
  render () {
    return <div>
      <Nav />
      <Outliner service={this.service.outliner} />
    </div>
  }
}
