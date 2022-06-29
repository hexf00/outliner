import { Concat, Service } from 'ioc-di';

import BlockService from '@/components/Outliner/Block/service';
import PageBlockService from '@/components/Outliner/PageBlock/service';

import { IBlock, IVault } from '../../types';
import * as VaultApi from '../../api/vault';

@Service()
export default class Vault implements IVault {
  name: string = 'default'
  blocks: BlockService[] = []
  menuKey: string | undefined = undefined


  setData (data: IVault) {
    this.blocks = data.blocks.map(it => Concat(this, new BlockService(it)))
    this.name = data.name
    this.menuKey = data.menuKey
  }

  getJSON (): IVault {
    const mapper = (it: BlockService): IBlock => {
      const { data } = it.getData()
      return {
        data,
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
    VaultApi.save(this)
  }

  getPage (key: string) {
    return this.blocks.find(it => it.key === key)
  }

  createPage (text: string): BlockService {
    const block = Concat(this, new PageBlockService())
    // TODO:考虑如何优化
    block.key = text

    this.blocks.push(block)
    return block
  }
}