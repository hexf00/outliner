import { Component, Prop, Vue } from 'vue-property-decorator'
import Outliner from '../../../components/Outliner'
import HomeService from './service'
import Nav from '../../App/Nav'

@Component
export default class Home extends Vue {
  declare $props: {
    service: HomeService
  }
  @Prop() service !: HomeService
  render () {
    return <div>
      <Outliner service={this.service.outliner} />
    </div>
  }
}
