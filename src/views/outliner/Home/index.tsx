import { Component, Prop, Vue } from 'vue-property-decorator';

import BlockService from '@/components/Outliner/Block/service';
import PageBlock from '@/components/Outliner/PageBlock';
import { EditorService } from '@/views/editor/components/Editor/service';
import ContextMenu from '@/views/editor/ContextMenu';

import $ from './index.module.scss';

export interface IView {
  loading: boolean
  menu: BlockService
  page: BlockService
  editor: EditorService
}
@Component
export default class Home extends Vue {
  declare $props: {
    service: IView
  }
  @Prop() service !: IView
  render () {
    const service = this.service
    if (!service.loading) return <div>loading....</div>

    return <div class={$.editor}>
      <PageBlock class={$.menu} service={service.menu} />
      <PageBlock class={$.content} service={service.page} />
      <ContextMenu service={this.service.editor.contextMenu} />
    </div>
  }
}
