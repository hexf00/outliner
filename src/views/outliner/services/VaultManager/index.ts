import { get, set } from 'idb-keyval';

import { IVault } from '../../types';
import Vault from '../Vault';

export default class VaultManager {
  load (name = 'default') {
    return get<IVault>(name + '_data')
  }

  save (vault: Vault) {
    const data = vault.getJSON()
    set(vault.name + '_data', data)
  }
}