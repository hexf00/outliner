import Node from "../Node/service";

/**
 * 中间结构，用来生成BlockService
 */
export default class TextNode extends Node<TextNode> {
  content: string = ""
  spaceNumber: number = 0

  setData (data: { content: string, spaceNumber: number }) {
    this.content = data.content
    this.spaceNumber = data.spaceNumber
  }
}