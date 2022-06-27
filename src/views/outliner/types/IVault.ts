import { IBlock } from "./IBlock"

export interface IVault {
  name: string
  blocks: IBlock[]
  /** 作为固定在左侧的菜单 */
  menuKey?: string
}