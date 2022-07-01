
import { Already, Inject, Service } from 'ioc-di';

import DirProxy from '@/services/webfs/DirProxy';
import { IFileProxy } from '@/services/webfs/FileProxy';
import Cache from '@/services/Cache';

@Service()
export default class HomeService {
  @Inject(DirProxy) dirProxy !: DirProxy
  @Inject(DirProxy) DirHandler !: DirProxy

  get handler () {
    return this.dirProxy.handler || undefined
  }
  get hasAuth () {
    return this.dirProxy.hasAuth
  }

  cache = new Cache()

  constructor () {
    this.cache.setKey('dirHandler')
    this.init()
  }

  @Already
  async init () {
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
    this.getFiles()
  }

  async getAuth () {
    const hasAuth = await this.dirProxy.verifyPermission()
    if (!hasAuth) throw Error('用户拒绝了授权')
    this.dirProxy.hasAuth = hasAuth
    this.getFiles()
  }

  async changeDir () {
    const handler = await this.dirProxy.showDirPicker()
    this.cache.set(handler)
    this.getFiles()
  }

  async getFiles () {
    console.log(await this.dirProxy.getFiles())
  }

  async preview (file: IFileProxy) {
    if (file.type.includes('image')) {
      document.body.append(await file.getContents())
    }
  }
}