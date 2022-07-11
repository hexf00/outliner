
import { Already, Inject, Service } from 'ioc-di';

import DirHandlerService from '@/components/DirHandler/service';
import BlockService from '@/components/Outliner/Block/service';
import { EditorService } from '@/views/editor/components/Editor/service';

import AutoSaver from '../services/AutoSaver';
import Menu from '../services/Menu';
import PageSync from '../services/Sync/page';
import TabManager from '../services/TabManager';
import Usage from '../services/Usage';
import UsageManager from '../services/UsageManager';
import Vault from '../services/Vault';
import VaultManager from '../services/VaultManager';
import { IView } from './';
import FsBackup from '../services/backup/fs';
// import qs from 'qs';


@Service()
export default class HomeService implements IView {
  @Inject(Vault) vault!: Vault
  @Inject(UsageManager) usageManager!: UsageManager
  @Inject(Usage) usage!: Usage
  @Inject(EditorService) editor!: EditorService
  @Inject(AutoSaver) saver!: AutoSaver
  @Inject(TabManager) tab!: TabManager
  @Inject(VaultManager) vaults!: VaultManager
  @Inject(Menu) _menu!: Menu
  @Inject(PageSync) pageSync!: PageSync
  @Inject(DirHandlerService) dirHandler!: DirHandlerService

  @Inject(FsBackup) backup!: FsBackup

  loading = false


  get page () {
    return this.tab.current
  }

  get menu (): BlockService {
    return this._menu.data!
  }

  constructor () {
    this.init()

    // console.log(
    //   decodeURI(qs.stringify({
    //     sortField: [{
    //       fieldName: 'field2',
    //       sortType: 1,
    //     }]
    //   }, {
    //     allowDots: true
    //   }))
    // )
  }

  @Already
  async init () {
    this.loading = false

    this.dirHandler.init('outliner_backup')

    try {
      await this.vaults.open({ name: 'default' })
    } catch (error) {
      this.vaults.add({ name: 'default' })
      this.vaults.open({ name: 'default' })
    }

    this.loading = true
  }
}