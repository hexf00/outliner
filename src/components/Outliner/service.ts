import { Concat, Service } from 'ioc-di';
import PlainParser from '../../services/tree/PlainParser/service';
import BlockService from "./Block/service";
import { IBlock } from "./types";


@Service()
export class OutlinerService {

  pageBlock: BlockService = Concat(this, new BlockService())

  menuBlock: BlockService = Concat(this, new BlockService())

  text = `1
  2
    3
  3 
    4`

  constructor () {
    this.parsePlain(this.text)

    this.menuBlock.setData(PlainParser.parse(`[[文件1]]
      [[文件2]]
      [[文件3]]`))
  }



  stringifyPlain () {
    //说明：需要删除最后一项多出的换行符
    this.text = this.pageBlock.toPlain().slice(0, -1)
  }

  /** 将文本解析为tree结构 */
  parsePlain (text: string) {
    // console.log()
    this.setData(PlainParser.parse(text))
  }

  getData () {
    return this.pageBlock.getData()
  }

  setData (content: IBlock) {
    this.pageBlock.setData(content)
  }
}