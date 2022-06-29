import { get, set } from 'idb-keyval';
import { IVaultMeta } from '../../types';

import { IView } from '../../components/vault/list/index'
import { Concat, Inject, Service } from 'ioc-di';
import AddService from '../../components/vault/add/service';
import * as VaultApi from '../../api/vault';

import Vault from '../../services/Vault';
import UsageManager from '../UsageManager';
import Usage from '../Usage';
import TabManager from '../TabManager';
import Menu from '../Menu';
import PageBlockService from '@/components/Outliner/PageBlock/service';
/** 多Vault */
@Service()
export default class VaultManager implements IView {
  @Inject(AddService) adder !: AddService
  @Inject(Vault) vault!: Vault
  @Inject(UsageManager) usageManager!: UsageManager
  @Inject(Usage) usage!: Usage

  @Inject(TabManager) tab!: TabManager

  @Inject(Menu) menu!: Menu

  isShowAdd = false
  data: IVaultMeta[] = []

  constructor () {
    this.init()
  }
  async init () {
    this.data = await this.load() || []
  }

  showAdd (): void {
    this.isShowAdd = true
    this.adder.name = ''
  }

  hideAdd (): void {
    this.isShowAdd = false
  }
  async open (vault: IVaultMeta) {
    const data = await VaultApi.load(vault.name)
    if (data) {
      this.vault.setData(data)
      this.usage.name = data.name
      const usage = await this.usageManager.load(data.name)
      this.menu.setData(this.vault.getMenu()!)
      if (usage) {
        this.usage.setData(usage)
        const page = this.vault.getPage(usage.lastKey)

        // 优先显示上次停留的页面
        this.tab.setCurrent(page || this.vault.getLastBlock()!)
      } else {
        this.tab.setCurrent(this.vault.getLastBlock()!)
      }
    } else {
      throw new Error('vault not found')
    }
  }

  add (vaultData: IVaultMeta) {
    this.data.push({
      name: vaultData.name
    })
    // 初始化一个Vault
    const vault = Concat(this, new Vault())
    const menu = Concat(this, new PageBlockService())
    const page = Concat(this, new PageBlockService())

    vault.setData({
      name: vaultData.name,
      blocks: [
        menu,
        page
      ],
      menuKey: menu.key
    })
    vault.save()

    this.save()
  }

  load () {
    return get<IVaultMeta[]>('vault_meta')
  }

  save () {
    return set('vault_meta', this.data)
  }
}