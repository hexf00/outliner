import BlockService from "@/components/Outliner/Block/service";
import { Already, Destroy, Inject, Service } from "ioc-di";
import OPManager from "../OPManager";
import Usage from "../Usage";
import Vault from "../Vault";

@Service()
export default class TabManager {
  @Inject(OPManager) opManager!: OPManager
  @Inject(Usage) usage!: Usage
  @Inject(Vault) vault!: Vault

  current !: BlockService
  _clear: Function | null = null

  constructor () {
    this.init()
  }

  @Already
  init () {
    this._clear = this.opManager.onLinkClick((text: string) => {
      // 用户切换了页面
      const page = this.vault.getPage(text)
      if (page) {
        this.setCurrent(page)
      } else {
        this.setCurrent(this.vault.createPage(text))
      }
    })
  }

  setCurrent (page: BlockService) {
    this.current = page

    this.usage.lastKey = page.key
    this.usage.save()
  }

  @Destroy
  destroy () {
    this._clear?.()
  }
}