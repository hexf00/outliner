import { Component, Prop, Vue } from 'vue-property-decorator'
import ContextMenu from '../ContextMenu'
import Editor from '../Editor'
import HomeService from './service'

@Component
export default class Home extends Vue {
  declare $props: {
    service: HomeService
  }
  @Prop() service !: HomeService
  render () {
    const { editor, ranger: looker } = this.service
    return <div>
      <Editor style="width:120px" service={editor} />
      <ContextMenu service={editor.contextMenu} />

      <pre>{JSON.stringify(looker.getData())}</pre>
      <pre>{JSON.stringify(editor.data, null, 2)}</pre>
    </div>
  }
}
