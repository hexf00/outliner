import { Component, Prop, Vue } from 'vue-property-decorator';

import BlockService from '@/components/Outliner/Block/service';
import PageBlock from '@/components/Outliner/PageBlock';
import { EditorService } from '@/views/editor/components/Editor/service';
import ContextMenu from '@/views/editor/ContextMenu';

import VaultList, * as NVaultList from '../components/vault/list'

import $ from './index.module.scss';
import classNames from 'classnames';
import DirHandler, * as NDirHandler from '@/components/DirHandler';

export interface IView {
  loading: boolean
  saver: {
    /** 未保存的修改计数 */
    changes: number
    save (): void
  }
  vault: {
    name: string
    export (): void
  }
  menu: BlockService
  page: BlockService
  editor: EditorService
  vaults: NVaultList.IView
  dirHandler: NDirHandler.IView
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

    return <div>
      <div class={classNames($.tip, service.saver.changes === 0 && $.success)}>
        {service.saver.changes}个变更未保存，<button onclick={() => service.saver.save()}>保存</button>
        <button onclick={() => { service.vault.export() }}>导出</button>
        <DirHandler service={this.service.dirHandler} />
      </div>

      <VaultList service={service.vaults} />
      <div>
        当前Vault: {service.vault.name},
        标题: {service.page.key}
      </div>

      <div class={$.editor}>
        <PageBlock class={$.menu} service={service.menu} />
        <div class={$.content}>
          <PageBlock service={service.page} />
        </div>
      </div>

      <ContextMenu service={this.service.editor.contextMenu} />
    </div>
  }
}
