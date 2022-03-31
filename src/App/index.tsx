import { Component, Vue } from 'vue-property-decorator'
import Hello from '../Hello'
import AppService from './service'

@Component
export default class App extends Vue {
  service = new AppService()
  render () {
    return <div>
      <Hello service={this.service.hello} />
    </div>
  }
}
