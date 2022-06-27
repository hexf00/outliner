import BlockService from "../Block/service";
import { IBlock } from "../types";

export default class PageBlockService extends BlockService {
  constructor (data?: IBlock) {
    super(data)

    //有一个默认的节点，不然显示无法操作
    if (!data) {
      this.addChild(this.create())
    }
  }
}