import { IAtom } from "@/views/editor/types"
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

      //AST解析content中所有的双链[[]]语法, 如果是链接，则解析为LinkNode, 否则解析为TextNode
      const data: IAtom[] = []
      let index = 0
      while (index < content.length) {
        const start = content.indexOf('[[', index)
        if (start === -1) {
          data.push({
            text: content.substring(index)
          })
          break
        }
        data.push({
          text: content.substring(index, start)
        })
        const end = content.indexOf(']]', start)
        if (end === -1) {
          data.push({
            text: content.substring(start)
          })
          break
        }
        data.push({
          type: 'link',
          text: content.substring(start + 2, end)
        })
        index = end + 2
      }

      node.setData({
        data,
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