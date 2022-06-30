import { Already, Destroy, Inject, Service } from 'ioc-di';

import Vault from '../../Vault';
import VaultManager from '../../VaultManager';

/** 浏览器中多页面同步 */
@Service()
export default class PageSync {
  @Inject(VaultManager) vaults!: VaultManager
  @Inject(Vault) vault!: Vault

  _clear: Function | null = null

  constructor () {
    this.init()
  }

  @Already
  init () {
    this._onStorage = this.onStorage.bind(this)
    window.addEventListener('storage', this._onStorage)
  }

  _onStorage: ((e: StorageEvent) => void) | null = null
  onStorage (e: StorageEvent) {
    // 只会在其它页面触发
    if (e.key !== 'save') return
    const data = JSON.parse(e.newValue || '{}')
    if (data.vault !== this.vault.name) return

    this.vaults.refresh()
  }

  emitSave () {
    localStorage.setItem('save', JSON.stringify({
      vault: this.vault.name,
      time: Date.now()
    }))
  }

  @Destroy
  destroy () {
    if (this._onStorage) window.removeEventListener('storage', this._onStorage)
  }
}