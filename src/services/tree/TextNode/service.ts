import { IAtom } from "@/views/editor/types";
import Node from "../Node/service";

/**
 * 中间结构，用来生成BlockService
 */
export default class TextNode extends Node<TextNode> {
  content: string = ""
  data: IAtom[] = []
  spaceNumber: number = 0

  setData (data: { data: IAtom[], spaceNumber: number }) {
    this.data = data.data
    this.spaceNumber = data.spaceNumber
  }
}