import BlockService from "@/components/Outliner/Block/service";
import { Already, Destroy, Inject, Service } from "ioc-di";
import OPManager from "../OPManager";
import Vault from "../Vault";

@Service()
export default class TabManager {
  @Inject(OPManager) opManager!: OPManager
  @Inject(Vault) vault!: Vault

  current !: BlockService
  _clear: Function | null = null

  constructor () {
    this.init()
  }

  @Already
  init () {
    this._clear = this.opManager.onLinkClick((text: string) => {
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
  }

  @Destroy
  destroy () {
    this._clear?.()
  }
}