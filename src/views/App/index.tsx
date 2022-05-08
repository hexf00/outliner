import { Component, Vue } from 'vue-property-decorator'
import Router from '../../components/Router'
import AppService from './service'

@Component
export default class App extends Vue {
  service = new AppService()

  render () {
    const { router } = this.service
    return <div>
      <Router service={router} />
    </div>
  }
}