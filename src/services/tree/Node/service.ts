
export interface INode {
  children: INode[]
  parent: INode
  setParent (parent: INode): void
  addChild (node: INode): void
}

export default abstract class Node<T extends INode> implements INode {
  children: T[] = []
  parent: T = this as unknown as T

  setParent (parent: T) {
    this.parent = parent
  }

  getParent (): T {
    return this.parent
  }

  addChild (node: T) {
    node.setParent(this)
    this.children.push(node)
  }

  getChildren () {
    return this.children
  }
}