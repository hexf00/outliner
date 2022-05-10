import { Component, Prop, Vue } from 'vue-property-decorator'
import HomeService from './service'
import Nav from '../../App/Nav'
import Explorer from '../Explorer'

@Component
export default class Home extends Vue {
  declare $props: {
    service: HomeService
  }
  @Prop() service !: HomeService
  render () {
    return <div>
      <Explorer service={this.service.explorer} />
    </div>
  }
}
