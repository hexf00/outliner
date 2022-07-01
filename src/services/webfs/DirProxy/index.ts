import Cache from "../../Cache"
import FileProxy, { IFileProxy } from "../FileProxy"

export interface IDirProxy {
  init (): void
  getFiles (): Promise<IFileProxy[]>
}

export default class DirProxy implements IDirProxy {

  cache = new Cache()

  handler: FileSystemDirectoryHandle | null = null

  hasAuth = false

  files: IFileProxy[] = []

  constructor () {
    // 改为外部初始化，因为init是异步动作，内部初始化外部无法判断初始化完成的时机
    // this.init()
  }

  async init () {
    this.cache.setKey('dirHandler')
    const cacheHandler = await this.cache.get()
    // console.log('cacheHandler', cacheHandler, cacheHandler instanceof FileSystemDirectoryHandle)
    if (cacheHandler instanceof FileSystemDirectoryHandle) {
      this.handler = cacheHandler
      // 此处不管权限，权限在外部管理
      return
    }
  }

  // 该方法需要由用户的手动触发
  // 用户如果没有关闭所有的标签页，则不需要重新授权
  // DOMException: User activation is required to request permissions.
  async verifyPermission (handler?: FileSystemDirectoryHandle): Promise<boolean> {
    const fileHandle = handler || this.handler
    if (!fileHandle) throw Error('handler is null')

    const options = { mode: 'readwrite' as const };
    // Check if permission was already granted. If so, return true.
    if ((await fileHandle.queryPermission(options)) === 'granted') {
      return true;
    }
    // Request permission. If the user grants permission, return true.
    if ((await fileHandle.requestPermission(options)) === 'granted') {
      return true;
    }
    // The user didn't grant permission, so return false.
    return false;
  }


  async showDirPicker () {
    const handler = await window.showDirectoryPicker()
    const status = await this.verifyPermission(handler)
    if (!status) throw Error('用户拒绝了授权')

    // 授权成功才变化目录信息
    this.handler = handler
    this.hasAuth = status
    await this.cache.set(handler)
  }

  // 需要先请求权限
  // DOMException: The request is not allowed by the user agent or the platform in the current context.
  async getFiles (): Promise<IFileProxy[]> {
    if (!this.handler) throw Error('handler is null')

    const dirHandle = this.handler

    const result: IFileProxy[] = []
    for await (const item of dirHandle.values()) {
      if (item.kind === 'directory') {
        // 跳过
      } else if (item.kind === 'file') {
        result.push(
          new FileProxy({
            handler: item,
            file: await item.getFile()
          })
        )
      }
    }

    this.files = result

    return result
  }
}