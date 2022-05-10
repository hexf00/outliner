import { Component, Prop, Vue } from 'vue-property-decorator'
import ExplorerService from './service'
@Component
export default class Explorer extends Vue {
  declare $props: {
    service: ExplorerService
  }

  @Prop() service !: ExplorerService

  render () {
    const service = this.service
    return (
      <div>
        <button onclick={async () => service.onClick()}>选择文件夹</button>
        <button onclick={async () => service.next()}>下一个</button>
        <button onclick={async () => service.prev()}>上一个</button>
        <div>
          <div>总文件数: {service.files.length} </div>
          <div>当前索引: {service.currentFileIndex}</div>
          <div>当前文件名: {service.currentFile?.path}</div>
          <div>当前文件大小: {service.currentFile?.file.size}</div>
        </div>
      </div>
    )
  }
}
