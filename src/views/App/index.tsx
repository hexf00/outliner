import { Component, Provide, Vue } from 'vue-property-decorator'
import Router from '../../components/Router'
import AppService from './service'

@Component
export default class App extends Vue {
  service = new AppService()

  @Provide('router') router = this.service.router

  render () {
    const { router } = this.service
    return <div>
      <Router service={router} />
    </div>
  }
}