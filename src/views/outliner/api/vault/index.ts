import { get, set } from 'idb-keyval';

import { IVault } from '../../types';
import Vault from '../../services/Vault';

export const load = (name = 'default') => {
  return get<IVault>('vault_data_' + name)
}

export const save = (vault: Vault) => {
  const data = vault.getJSON()

  console.warn('save', data)
  set('vault_data_' + vault.name, data)
}