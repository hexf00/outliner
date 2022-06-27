import { Concat, Inject, Service } from 'ioc-di';

import BlockService from '@/components/Outliner/Block/service';

import { IBlock, IVault } from '../../types';
import VaultManager from '../VaultManager';

@Service()
export default class Vault implements IVault {

  @Inject(VaultManager) vaultManager!: VaultManager
  name: string = ''
  blocks: BlockService[] = []
  menuKey: string | undefined = undefined


  setData (data: IVault) {
    this.blocks = data.blocks.map(it => Concat(this, new BlockService(it)))
    this.name = data.name
    this.menuKey = data.menuKey
  }

  getJSON (): IVault {
    const mapper = (it: BlockService): IBlock => {
      return {
        data: it.data,
        children: it.children.map(mapper),
        key: it.key
      }
    }

    return {
      name: this.name,
      blocks: this.blocks.map(mapper),
      menuKey: this.menuKey
    }
  }

  getMenu (): BlockService | undefined {
    if (!this.menuKey) return
    return this.blocks.find(it => this.menuKey === it.key)
  }

  // 获取最后加入的一个Block
  getLastBlock (): BlockService | undefined {
    return this.blocks[this.blocks.length - 1]
  }

  save () {
    this.vaultManager.save(this)
  }
}