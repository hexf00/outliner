import { get, set } from 'idb-keyval';

import { IVault } from '../../types';
import Vault from '../Vault';

export default class VaultManager {
  load (name = 'default') {
    return get<IVault>(name)
  }

  save (vault: Vault) {
    const data = vault.getJSON()
    set(vault.name, data)
  }
}