import { get, set } from 'idb-keyval';

import { IUsage } from '../../types';
import Usage from '../Usage';

/** 记录一些使用数据 */
export default class UsageManager {
  load (name = 'default') {
    return get<IUsage>(name + '_usage')
  }

  save (usage: Usage) {
    const data = usage.getJSON()
    set(usage.name + '_usage', data)
  }
}