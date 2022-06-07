/**
 * @jest-environment jsdom
 */

import { EditorService } from "@/views/editor/Editor/service"
import { Concat, Root } from "ioc-di"


class Entry { }
const diRoot = diNew()
function diNew (Class: any = Entry, args?: any) {
  return new (Root()(Class))(args)
}

const editor = Concat(diRoot, new EditorService())
const el = document.createElement('div')
editor.setEl(el)

describe('Hello', () => {

  it('空白插入文本', async () => {
    const data = [];
    editor.setData(data)

    const range = {
      endContainer: el,
      endOffset: 0,
      startContainer: el,
      startOffset: 0,
    }
    const dataRange = editor.ranger.toDataRange(range)

    expect(dataRange).toStrictEqual({ startIndex: 0, endIndex: 0, startOffset: 0, endOffset: 0 })
  })

})
