import { get, set } from 'idb-keyval';

import { IVault } from '../../../types';
import Vault from '../../../services/Vault';

export default class VaultApi {
  load (name = 'default') {
    return get<IVault>('vault_data_' + name)
  }

  save (vault: Vault) {
    const data = vault.getJSON()
    set('vault_data_' + vault.name, data)
  }
}