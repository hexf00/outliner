import { IAtom } from "@/views/editor/types"

export interface IBlock {
  data: IAtom[]
  children: IBlock[]
}