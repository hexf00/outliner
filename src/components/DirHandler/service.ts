import { Already, Inject, Service } from 'ioc-di';

import Cache from '@/services/Cache';
import DirProxy from '@/services/webfs/DirProxy';

import { IView } from './';

@Service()
export default class DirHandlerService implements IView {
  @Inject(DirProxy) dirProxy !: DirProxy

  get handler () {
    return this.dirProxy.handler || undefined
  }
  get hasAuth () {
    return this.dirProxy.hasAuth
  }

  cache = new Cache()

  @Already
  async init (key = 'dirHandler') {
    this.cache.setKey(key)
    const cacheHandler = await this.cache.get()
    if (cacheHandler instanceof FileSystemDirectoryHandle) {
      this.dirProxy.setHandler(cacheHandler)
    } else {
      return
    }

    // 说明：此处仅在用户授权，且标签页未完全关闭才能调通
    const hasAuth = await this.dirProxy.verifyPermission()
    if (!hasAuth) throw Error('没有权限')
    this.dirProxy.hasAuth = hasAuth
  }

  async getAuth () {
    const hasAuth = await this.dirProxy.verifyPermission()
    if (!hasAuth) throw Error('用户拒绝了授权')
    this.dirProxy.hasAuth = hasAuth
  }

  async changeDir () {
    const handler = await this.dirProxy.showDirPicker()
    this.cache.set(handler)
  }
}