
import { Already, Inject, Service } from "ioc-di";
import DirProxy from "../services/DirProxy";
import { IFileProxy } from "../services/FileProxy";

@Service()
export default class HomeService {
  @Inject(DirProxy) dirProxy !: DirProxy

  constructor () {
    this.init()
  }

  @Already
  async init () {
    await this.dirProxy.init()
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
    await this.dirProxy.showDirPicker()
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