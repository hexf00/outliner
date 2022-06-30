import { get, set, del } from 'idb-keyval';
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
import { confirm } from '@/components/Confirm';
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

    return vault
  }

  import (e: InputEvent): void {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file) return

    var reader = new FileReader();
    reader.readAsText(file)
    reader.onload = () => {
      const data = JSON.parse(reader.result as string)

      const getName = (name: string): string => {
        const index = this.data.findIndex(it => it.name === name)
        if (index === -1) {
          return name
        } else {
          return getName(`${name}_导入`)
        }
      }

      const name = getName(data.name)
      const vault = this.add({
        ...data,
        name
      })

      vault.setData({
        ...data,
        name
      })

      vault.save()

      setTimeout(() => {
        console.log(JSON.stringify(vault.getJSON()))
      }, 5000)

    }
  }

  async remove (vault: IVaultMeta) {
    await confirm('确定删除该Vault吗？')

    const index = this.data.findIndex(it => it.name === vault.name)
    if (index !== -1) {
      this.data.splice(index, 1)
    }

    del('vault_usage_' + vault.name)
    del('vault_data_' + vault.name)
    this.save()
  }

  load () {
    return get<IVaultMeta[]>('vault_meta')
  }

  save () {
    return set('vault_meta', this.data)
  }
}