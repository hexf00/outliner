import { get, set } from 'idb-keyval';

import { IVault } from '../../types';
import Vault from '../Vault';

export default class VaultManager {
  load (name = 'default') {
    return get<IVault>('vault_data_' + name)
  }

  save (vault: Vault) {
    const data = vault.getJSON()
    set('vault_data_' + vault.name, data)
  }
}