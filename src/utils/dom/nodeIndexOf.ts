export function nodeIndexOf (parent: Node, findChild: Node): number {
  let index = -1
  for (let i = 0, l = parent.childNodes.length; i < l; i++) {
    const child = parent.childNodes[i]
    if (findChild === child) {
      index = i
      break
    }
  }
  return index
}