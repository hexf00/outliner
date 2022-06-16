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
          <button onclick={() => this.service.mapping.enable()}>启用关联</button>
          <button onclick={() => this.service.mapping.disable()}>禁用关联</button>
          <button onclick={() => this.service.mapping.setData([])}>清空</button>
          <button onclick={() => this.service.right.enableSort()}>启用target排序</button>
          <button onclick={() => this.service.right.disableSort()}>禁用target排序</button>
          source
          <List class={$.list} service={this.service.left} />
        </div>
        <div>
          target
          <List class={$.list} service={this.service.right} />
        </div>
        {this.service.mapping.isEnable && <Canvas class={$.canvas} service={this.service.canvas} />}
      </div>
    </div>
  }
}
