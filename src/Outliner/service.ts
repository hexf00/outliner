import { parse } from 'csv-parse/browser/esm/sync';
import PlainParser from '../services/tree/PlainParser/service';
import TextNode from "../services/tree/TextNode/service";
import BlockService from "./Block/service";
import { IBlock } from "./types";

export class OutlinerService {

  content: BlockService[] = []
  text = `1
  2
    3
  3 
    4`

  constructor () {
    this.parsePlain(this.text)
  }

  parse (data: IBlock, { parent }: { parent?: BlockService }): BlockService {
    const block = new BlockService()
    parent && block.setParent(parent)

    block.content = data.content
    if (data.children && data.children.length) {
      data.children.forEach(child => {
        block.children.push(this.parse(child, { parent: block }))
      })
    }
    return block
  }

  toPlain () {
    return this.content.map(block => block.toPlain()).join('\n')
  }

  stringifyPlain (): any {
    this.text = this.toPlain()
  }

  /** 将文本解析为tree结构 */
  parsePlain (text: string) {
    // console.log()
    this.setData(PlainParser.parse(text).getChildren())
  }

  getData () {
    return this.content.map(block => block.getData())
  }

  setData (content: IBlock[]) {
    this.content = content.map(data => this.parse(data, {}))
  }
}