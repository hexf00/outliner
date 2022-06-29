import { IBlock } from "./IBlock"


export interface IVaultMeta {
  /** vault 名称 */
  name: string
}

export interface IVault {
  name: string
  blocks: IBlock[]
  /** 作为固定在左侧的菜单 */
  menuKey?: string
}
