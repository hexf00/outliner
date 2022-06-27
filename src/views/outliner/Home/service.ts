
import { Already, Concat, Inject, Service } from 'ioc-di';

import BlockService from '@/components/Outliner/Block/service';
import PageBlockService from '@/components/Outliner/PageBlock/service';
import { EditorService } from '@/views/editor/components/Editor/service';

import Vault from '../services/Vault';
import VaultManager from '../services/VaultManager';
import { IView } from './';

@Service()
export default class HomeService implements IView {
  @Inject(Vault) vault!: Vault
  @Inject(VaultManager) vaultManager!: VaultManager
  @Inject(EditorService) editor!: EditorService

  loading = false
  page!: BlockService
  menu!: BlockService

  constructor () {
    this.init()
  }

  @Already
  async init () {

    const data = await this.vaultManager.load()
    if (data) {
      this.vault.setData(data)
      this.menu = this.vault.getMenu()!
      this.page = this.vault.getLastBlock()!
    } else {
      // 初始化一个Vault
      const menu = this.menu = Concat(this, new PageBlockService())
      const page = this.page = Concat(this, new PageBlockService())

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