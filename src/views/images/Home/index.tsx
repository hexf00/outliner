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
    const { handler, hasAuth, files } = dirProxy

    return <div>
      <div>handler:{handler ? handler.name : ''}</div>
      <div>hasAuth:{hasAuth ? '有' : '无'}
        {!hasAuth && <button onclick={() => this.service.getAuth()}>授权</button>}
      </div>
      <div><button onclick={() => this.service.changeDir()}>change dir</button></div>

      <div>
        {files.map(file => <div>
          <div onclick={() => this.service.preview(file)}>{file.name}</div>
          <div>{file.type}</div>
          <div>{file.size}</div>
          <div>{file.lastModified}</div>
        </div>)}
      </div>
    </div>
  }
}
