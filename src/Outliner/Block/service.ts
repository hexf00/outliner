import { Destroy } from "ioc-di";
import Callback from "../../services/Callback/Callback";
import { focusNextElement } from "../../utils";
import { IBlock } from "../types";

export default class BlockService implements IBlock {



  // 随机字符串
  key = Math.random().toString(36).substr(2, 16)
  content: string = ''
  parent: null | BlockService = null
  children: BlockService[] = []
  lv: number = 0


  constructor () {
  }

  setParent (parent: BlockService | null) {
    this.parent = parent
    this.lv = parent ? parent.lv + 1 : 0
  }


  getParent () {
    return this.parent
  }
  addChild (child: BlockService, pos?: number) {
    child.setParent(this)
    if (pos === undefined) {
      this.children.push(child)
    } else {
      this.children.splice(pos, 0, child)
    }
  }

  /** 在下方插入兄弟节点 */
  addNeighbor () {
    const index = this.parent?.children.indexOf(this)
    if (index === -1 || index === undefined) {
      console.warn('需要处理异常情况')
      return
    }
    this.parent?.addChild(new BlockService(), index + 1)
  }

  toPlain (): string {
    let result = this.content
    this.children.forEach(child => {
      result += '\n' + Array(this.lv + 1).fill("  ").join('') + child.toPlain()
    })
    return result
  }
  setData (innerText: string) {
    // console.log('innerText', innerText)
    this.content = innerText
  }
  getData (): IBlock {
    return {
      content: this.content,
      children: this.children.map(child => child.getData())
    }
  }

  /** 获取相邻的上一个节点 */
  getUp () {
    const index = this.parent?.children.indexOf(this)
    if (index === -1 || index === undefined) {
      console.warn('需要处理异常情况')
      return
    }
    return this.parent?.children[index - 1]
  }

  toBeUpChild () {
    const index = this.parent?.children.indexOf(this)
    if (index === -1 || index === undefined) {
      console.warn('需要处理异常情况')
      return
    }

    if (index === 0) return
    const up = this.getUp()
    this.parent?.children.splice(index, 1)
    up?.addChild(this)
  }

  /** 移动到父节点的下一个相邻节点位置 */
  toParentDown () {
    const parent = this.parent
    if (!parent) return


    const parentIndex = parent.parent?.children.indexOf(parent)
    if (parentIndex === -1 || parentIndex === undefined) {
      console.warn('需要处理异常情况')
      return
    }

    const index = parent.children.indexOf(this)
    if (index === -1 || index === undefined) {
      console.warn('需要处理异常情况')
      return
    }

    parent.children.splice(index, 1)
    parent.parent?.addChild(this, parentIndex + 1)
  }

  tab (order: 'asc' | 'desc' = 'asc') {
    focusNextElement(order)
  }

  @Destroy
  destroy () {
  }
}