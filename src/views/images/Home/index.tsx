import { Component, Prop, Vue } from 'vue-property-decorator'
import HomeService from './service'

@Component
export default class Home extends Vue {
  declare $props: {
    service: HomeService
  }
  @Prop() service !: HomeService
  render () {

    const { dirProxy } = this.service
    const { handler, hasAuth } = dirProxy

    return <div>
      <div>handler:{handler ? handler.name : ''}</div>
      <div>hasAuth:{hasAuth ? '有' : '无'}
        {!hasAuth && <button onclick={() => this.service.getAuth()}>授权</button>}
      </div>
      <div><button onclick={() => this.service.changeDir()}>change dir</button></div>
    </div>
  }
}
