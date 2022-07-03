import DirProxy from '@/services/webfs/DirProxy';
import { Already, Destroy, Inject, Service } from 'ioc-di';

import OPManager from '../../OPManager';
import Vault from '../../Vault';

/** 文件备份 */
@Service()
export default class FsBackup {
  @Inject(OPManager) opManager!: OPManager
  @Inject(Vault) vault!: Vault

  @Inject(DirProxy) dirProxy!: DirProxy

  /** 未保存的修改计数 */
  changes = 0

  /** 保存触发计数 */
  saveCount = 10

  constructor () {
    this.init()
  }

  _clear: Function | null = null
  _clearTimer: number | null = null

  @Already
  init () {
    this._clear = this.opManager.onChange(() => {
      this.changes++
      if (this.changes >= this.saveCount) {
        this.save()
      }
    })

    this._clearTimer = window.setInterval(() => {
      if (this.changes > 0) {
        this.save()
      }
    }, 1000)
  }

  save () {
    this.changes = 0

    console.log(this.vault.getJSON())

    this.dirProxy.writeFile('vault.json', JSON.stringify(this.vault.getJSON()))
    // console.log('save')

    // this.vault.save()
    // console.log('数据已保存')
  }

  @Destroy
  destroy () {
    this._clear?.()
    this._clearTimer && window.clearInterval(this._clearTimer)
  }
}