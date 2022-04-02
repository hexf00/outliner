import { Component, Vue } from 'vue-property-decorator'
import CSV from '../CSV'
import Explorer from '../Explorer'
import AppService from './service'

@Component
export default class App extends Vue {
  service = new AppService()
  render () {
    return <div>
      {/* <CSV service={this.service.csv} /> */}
      <Explorer service={this.service.explorer} />
    </div>
  }
}
