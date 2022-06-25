import { splitOffset } from "./splitOffset"


// 例子
// 插入左括号
// this.data[startIndex].text = insertAt(this.data[startIndex].text, startOffset, '[')
// // 插入右括号
// this.data[endIndex].text = insertAt(this.data[endIndex].text, realEndOffset, ']')

export function insertAt (baseText: string, offset: number, text: string) {
  const [before, after] = splitOffset(baseText, offset)
  return before + text + after
}