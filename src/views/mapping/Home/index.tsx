import { Component, Prop, Vue } from 'vue-property-decorator'
import List from '../components/List'
import HomeService from './service'
import $ from './index.module.scss'
import Canvas from '../components/Canvas'

@Component
export default class Home extends Vue {
  declare $props: {
    service: HomeService
  }
  @Prop() service !: HomeService

  mounted () {
    // this.service.mapping.mounted()
  }

  render () {
    return <div>
      <div class={$.box}>
        <div>
          source
          <List class={$.list} service={this.service.left} />
        </div>
        <div>
          target
          <List class={$.list} service={this.service.right} />
        </div>
        <Canvas class={$.canvas} service={this.service.canvas} />
      </div>
    </div>
  }
}
