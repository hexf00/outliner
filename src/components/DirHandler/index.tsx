
import { Component, Prop, Vue } from 'vue-property-decorator';

export interface IView {
  handler?: { name: string }
  hasAuth: boolean
  changeDir (): void
  getAuth (): void
}
@Component
export default class DirHandler extends Vue {
  declare $props: {
    service: IView
  }
  @Prop() service !: IView
  render () {
    const { handler, hasAuth } = this.service

    return <div>
      {handler && <div>
        <div>handler:{handler ? handler.name : ''}</div>
        <div>hasAuth:{hasAuth ? '有' : '无'}
          {!hasAuth && <button onclick={() => this.service.getAuth()}>授权</button>}
        </div>
      </div>}
      <div><button onclick={() => this.service.changeDir()}>配置存储地址</button></div>
    </div >
  }
}
