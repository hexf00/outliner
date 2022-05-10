import { Component, Provide, Vue } from 'vue-property-decorator'
import Router from '../../components/Router'
import Nav from '../components/Nav'
import AppService from './service'

@Component
export default class App extends Vue {
  service = new AppService()

  @Provide('router') router = this.service.router

  render () {
    const { router } = this.service
    return <div>
      <Nav />
      <Router service={router} />
    </div>
  }
}