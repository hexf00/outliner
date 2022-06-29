
import { Already, Concat, Inject, Service } from 'ioc-di';

import BlockService from '@/components/Outliner/Block/service';
import PageBlockService from '@/components/Outliner/PageBlock/service';
import { EditorService } from '@/views/editor/components/Editor/service';

import AutoSaver from '../services/AutoSaver';
import TabManager from '../services/TabManager';
import Usage from '../services/Usage';
import UsageManager from '../services/UsageManager';
import Vault from '../services/Vault';
import VaultApi from './api/vault';
import { IView } from './';
@Service()
export default class HomeService implements IView {
  @Inject(Vault) vault!: Vault
  @Inject(VaultApi) vaultManager!: VaultApi
  @Inject(UsageManager) usageManager!: UsageManager
  @Inject(Usage) usage!: Usage

  @Inject(EditorService) editor!: EditorService
  @Inject(AutoSaver) saver!: AutoSaver
  @Inject(TabManager) tab!: TabManager

  loading = false

  menu!: BlockService

  get page () {
    return this.tab.current
  }

  constructor () {
    this.init()
  }

  @Already
  async init () {

    const data = await this.vaultManager.load()


    if (data) {
      this.vault.setData(data)
      this.usage.name = data.name

      const usage = await this.usageManager.load(data.name)

      this.menu = this.vault.getMenu()!


      if (usage) {
        this.usage.setData(usage)
        const page = this.vault.getPage(usage.lastKey)

        // 优先显示上次停留的页面
        this.tab.setCurrent(page || this.vault.getLastBlock()!)
      } else {
        this.tab.setCurrent(this.vault.getLastBlock()!)
      }
    } else {
      // 初始化一个Vault
      const menu = this.menu = Concat(this, new PageBlockService())
      const page = Concat(this, new PageBlockService())
      this.tab.setCurrent(page)

      console.log(this.menu.key)
      this.vault.setData({
        name: 'default',
        blocks: [
          menu,
          page
        ],
        menuKey: menu.key
      })
      this.vault.save()
    }

    this.loading = true
  }
}