import { Component, Prop, Vue } from 'vue-property-decorator'
import ContextMenu from '../ContextMenu'
import Viewer from '../components/Viewer'

import * as NViewer from '../components/Viewer'
import { IEditor } from '../types/IEditor'
export interface IView {
  data: NViewer.IView[]
  editor: IEditor
  ranger: {
    getData (): any
  }
}

@Component
export default class Home extends Vue {
  declare $props: {
    service: IView
  }
  @Prop() service !: IView
  render () {
    const { editor, ranger } = this.service
    return <div>
      {
        this.service.data.map(it => <Viewer style="width:120px" service={it} />)
      }
      <ContextMenu service={editor.contextMenu} />
      <pre>{JSON.stringify(ranger.getData())}</pre>
      <pre>{JSON.stringify(editor.data, null, 2)}</pre>
    </div>
  }
}
