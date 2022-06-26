import { Component, Prop, Vue } from 'vue-property-decorator';

import { OutlinerService } from '@/components/Outliner/service';
import { EditorService } from '@/views/editor/components/Editor/service';
import ContextMenu from '@/views/editor/ContextMenu';

import Outliner from '../../../components/Outliner';
import HomeService from './service';

export interface IView {
  outliner: OutlinerService
  editor: EditorService
}
@Component
export default class Home extends Vue {
  declare $props: {
    service: HomeService
  }
  @Prop() service !: HomeService
  render () {
    return <div>
      <Outliner service={this.service.outliner} />
      <ContextMenu service={this.service.editor.contextMenu} />
    </div>
  }
}
