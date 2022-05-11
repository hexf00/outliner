export function nodeIndexOf (el: Node, item: Node): number {
  let index = -1
  for (let i = 0, l = el.childNodes.length; i < l; i++) {
    const child = el.childNodes[i]
    if (item === child) {
      index = i
      break
    }
  }
  return index
}