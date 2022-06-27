import { Already, Destroy, Inject, Service } from 'ioc-di';

import OPManager from '../OPManager';
import Vault from '../Vault';

/** 操作总线 */
@Service()
export default class AutoSaver {
  @Inject(OPManager) opManager!: OPManager
  @Inject(Vault) vault!: Vault

  /** 修改计数 */
  changeCount = 0

  /** 保存触发计数 */
  saveCount = 10

  constructor () {
    this.init()
  }

  _clear: Function | null = null

  @Already
  init () {
    this._clear = this.opManager.onChange(() => {
      this.changeCount++
      if (this.changeCount >= this.saveCount) {

        this.changeCount = 0
        this.vault.save()
        console.log('数据已保存')
      }
    })
  }

  @Destroy
  destroy () {
    this._clear?.()
  }
}