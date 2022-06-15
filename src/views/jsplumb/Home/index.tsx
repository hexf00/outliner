import { Component, Prop, Vue } from 'vue-property-decorator'
import HomeService from './service'
import './index.scss'


@Component
export default class Home extends Vue {
  declare $props: {
    service: HomeService
  }
  @Prop() service !: HomeService

  mounted () {
    this.service.mapping.mounted()
  }

  render () {
    return <div>
      {/* <div class={$.box}>
        <List class={$.list} service={this.service.left} />
        <List class={$.list} service={this.service.right} />
      </div> */}

      <div class="jtk-demo-canvas" id="canvas">
        <div class="list list-lhs" id="list-one">
          <h3>LIST ONE</h3>
          <ul source id="list-one-list">
            <li>item one</li>
            <li>item two</li>
            <li>item three</li>
            <li>item four</li>
            <li>item five</li>
            <li>item six</li>
            <li>item seven</li>
            <li>item eight</li>
            <li>item nine</li>
            <li>item ten</li>
            <li>item eleven</li>
            <li>item twelve</li>
            <li>item thirteen</li>
            <li>item fourteen</li>
            <li>item fifteen</li>
            <li>item sixteen</li>
            <li>item seventeen</li>
            <li>item eighteen</li>
            <li>item nineteen</li>
            <li>item twenty</li>
            <li>item twenty one</li>
            <li>item twenty two</li>
            <li>item twenty three</li>
            <li>item twenty four</li>
            <li>item twenty five</li>
            <li>item twenty six</li>
            <li>item twenty seven</li>
            <li>item twenty eight</li>
            <li>item twenty nine</li>
            <li>item thirty</li>
            <li>item thirty one</li>
            <li>item thirty two</li>
            <li>item thirty three</li>
            <li>item thirty four</li>
          </ul>
        </div>
        <div class="list list-rhs" id="list-two">
          <h3>LIST TWO</h3>
          {/* jtk-scrollable-list 无效 */}
          <ul id="list-two-list">
            <li>item one</li>
            <li>item two</li>
            <li>item three</li>
            <li>item four</li>
            <li>item five</li>
            <li>item six</li>
            <li>item seven</li>
            <li>item eight</li>
            <li>item nine</li>
            <li>item ten</li>
            <li>item eleven</li>
            <li>item twelve</li>
            <li>item thirteen</li>
            <li>item fourteen</li>
            <li>item fifteen</li>
            <li>item sixteen</li>
            <li>item seventeen</li>
            <li>item eighteen</li>
            <li>item nineteen</li>
            <li>item twenty</li>
            <li>item twenty one</li>
            <li>item twenty two</li>
            <li>item twenty three</li>
            <li>item twenty four</li>
            <li>item twenty five</li>
            <li>item twenty six</li>
            <li>item twenty seven</li>
            <li>item twenty eight</li>
            <li>item twenty nine</li>
            <li>item thirty</li>
            <li>item thirty one</li>
            <li>item thirty two</li>
            <li>item thirty three</li>
            <li>item thirty four</li>
          </ul>
        </div>
      </div>
    </div>
  }
}
