import { Inject, Service } from 'ioc-di';

import { IUsage } from '../../types';
import UsageManager from '../UsageManager';

/** 记录一些使用数据 */
@Service()
export default class Usage implements IUsage {
  @Inject(UsageManager) usageManager!: UsageManager

  name: string = ''
  lastKey: string = ''

  setData (data: IUsage) {
    this.name = data.name
    this.lastKey = data.lastKey
  }

  getJSON (): IUsage {
    return {
      name: this.name,
      lastKey: this.lastKey
    }
  }

  save () {
    this.usageManager.save(this)
  }
}