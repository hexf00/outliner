import { IView } from './index';
import { Destroy } from "ioc-di";
import Callback from "../../services/Callback";
import { focusNextElement } from "../../utils";
import { IBlock } from "../types";

export default class BlockService implements IBlock, IView {



  // 随机字符串
  key = Math.random().toString(36).substr(2, 16)
  content: string = ''

  /** 父节点，如果没有则为自身 */
  parent: BlockService | null = null

  children: BlockService[] = []

  focusCallback = new Callback()


  constructor () {
  }

  setParent (parent: BlockService) {
    this.parent = parent
  }

  getParent () {
    return this.parent
  }

  setChildren (children: BlockService[]) {
    children.forEach(it => it.setParent(this))
    this.children = children
  }

  getChildren () {
    return this.children
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
    const node = new BlockService()
    this.parent?.addChild(node, index + 1)
    node.focus()
  }

  toPlain (lv = 0): string {
    let result = lv > 0 ? this.content + '\n' : ''
    result += this.children.map(child => (
      Array(lv).fill("  ").join('') + child.toPlain(lv + 1)
    )).join('')
    return result
  }

  parse (data: IBlock): BlockService {
    const block = new BlockService()
    block.setData(data)
    return block
  }

  setData (data: IBlock) {
    this.content = data.content
    this.setChildren(data.children.map(it => this.parse(it)))
  }

  setContent (text: string) {
    this.content = text
  }

  getData (): IBlock {
    return {
      content: this.content,
      children: this.children.map(child => child.getData())
    }
  }

  /** 是否是页面根节点 */
  isPage () {
    return !this.getParent()
  }

  //#region 获取相邻 block

  /** 获取相邻的上一个节点，或者父节，无则返回undefined */
  getPrev () {
    const parent = this.getParent()
    if (!parent) throw Error('异常情况，无父级')
    const index = parent.getChildren().indexOf(this)
    if (index === -1) throw Error('异常情况，索引丢失')

    if (index === 0) {
      if (!parent.isPage()) return parent
    } else {
      //需要找到最末端的节点
      let endNode = parent.children[index - 1]
      while (endNode.children.length) {
        endNode = endNode.children[endNode.children.length - 1]
      }
      return endNode
    }
  }

  /** 获取第一个子节点，或者下一个同级节点，无则返回undefined */
  getNext () {
    // console.log('getNext', this.content, this.getChildren())
    if (this.getChildren().length) {
      return this.getChildren()[0]
    } else {
      let parent: BlockService | null = this
      while (parent && !parent.isPage()) {
        const next = parent.getDown()
        if (next) return next
        parent = parent.getParent()
      }
    }
  }

  /** 获取同级相邻的上一个节点，如果本身是第一个节点，则无相邻的上一个节点，返回undefined */
  getUp () {
    const children = this.getParent()?.getChildren()
    if (!children) throw Error('异常情况，无父级')
    const index = children.indexOf(this)
    if (index === -1) throw Error('异常情况，索引丢失')
    if (index > 0) return children[index - 1]
  }

  /** 获取同层级相邻的下一个节点 */
  getDown () {
    const children = this.getParent()?.getChildren()
    if (!children) throw Error('异常情况，无父级')
    const index = children.indexOf(this)
    if (index === -1) throw Error('异常情况，索引丢失')
    if (index < children.length - 1) return children[index + 1]
  }

  // #endregion


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
    this.focus()
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
    // 说明：不适用setTimeout,mounted在beforeDestroy前面触发
    parent.parent?.addChild(this, parentIndex + 1)
    this.focus()
  }


  tab (order: 'next' | 'prev' = 'next') {
    console.log('tab', order)

    if (order === 'prev') {
      this.getPrev()?.focus()
    } else {
      // console.log('next', this.getNext())
      this.getNext()?.focus()
    }
  }

  remove () {
    if (this.children.length) return
    this.getPrev()?.focus()
    this.parent?.removeChild(this)
  }

  removeChild (node: BlockService) {
    const index = this.children.indexOf(node)
    if (index === -1) return
    this.children.splice(index, 1)
  }


  //#region 焦点相关

  focus () {
    setTimeout(() => {
      // console.log('setTimeout focus')
      this.focusCallback.run()
    }, 0)
  }

  bindFocus (fn: () => void) {
    this.focusCallback.add(fn)
  }

  unbindFocus (fn: () => void) {
    this.focusCallback.remove(fn)
  }

  //#endregion

  @Destroy
  destroy () {
    this.focusCallback.destroy()
  }
}