import { Already, Destroy, Inject, Service } from 'ioc-di';

import OPManager from '../OPManager';
import Vault from '../Vault';

/** 操作总线 */
@Service()
export default class AutoSaver {
  @Inject(OPManager) opManager!: OPManager
  @Inject(Vault) vault!: Vault

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
    this.vault.save()
    console.log('数据已保存')
  }

  @Destroy
  destroy () {
    this._clear?.()
    this._clearTimer && window.clearInterval(this._clearTimer)
  }
}