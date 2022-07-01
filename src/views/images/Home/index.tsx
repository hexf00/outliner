import DirHandler, * as NDirHandler from '@/components/DirHandler'
import { Component, Prop, Vue } from 'vue-property-decorator'
import HomeService from './service'

export interface IView {
  dirHandler: NDirHandler.IView
}

@Component
export default class Home extends Vue {
  declare $props: {
    service: HomeService
  }
  @Prop() service !: HomeService
  render () {

    const { dirProxy } = this.service
    const { files } = dirProxy

    return <div>
      <DirHandler service={this.service} />
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
