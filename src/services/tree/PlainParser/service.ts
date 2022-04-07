import TextNode from "../TextNode/service"

export default class PlainParser {

  /** 将文本按缩进解析为TreeNode */
  static parse (text: string) {
    const lines = text.split('\n')
    const root = new TextNode()
    let last = root
    lines.forEach(line => {
      const spaceNumber = line.match(/^\s*/)?.[0].length || 0
      const content = line.replace(/^\s*/, '')
      const node = new TextNode()
      node.setData({
        content,
        spaceNumber
      })

      // 假设父级是上一个新增节点
      let parent = last
      if (spaceNumber > parent.spaceNumber) {
        // 新增节点是上一个节点的子节点，不需处理
      } else {
        // 找最近父级
        while (spaceNumber <= parent.spaceNumber) {
          if (!parent.parent) break
          parent = parent.parent
        }
      }

      parent.addChild(node)
      last = node
    })
    // console.log('root', root.children)
    return root
  }
}