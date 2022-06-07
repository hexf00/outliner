import { IAtom } from "../../Editor";

/** 编辑器数据结构 */
export default class Data {
  data: IAtom[] = []

  getData () {
    return this.data
  }

  setData (data: IAtom[]) {
    this.data = data
  }
}