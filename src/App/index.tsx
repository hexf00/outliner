import { Component, Vue } from 'vue-property-decorator'
import CSV from '../CSV'
import AppService from './service'

@Component
export default class App extends Vue {
  service = new AppService()
  render () {
    return <div>
      <CSV service={this.service.csv} />
    </div>
  }
}
