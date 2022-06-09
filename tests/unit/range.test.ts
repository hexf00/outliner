/**
 * @jest-environment jsdom
 */

import { IAtom } from "@/views/editor/Editor"
import { EditorService } from "@/views/editor/Editor/service"
import type { IDataRange } from "@/views/editor/types"
import { Concat, Root } from "ioc-di"


class Entry { }
const diRoot = diNew()
function diNew (Class: any = Entry, args?: any) {
  return new (Root()(Class))(args)
}

const editor = Concat(diRoot, new EditorService())
const el = document.createElement('div')
editor.setEl(el)

describe('dataRange 操作数据测试', () => {

  it('空白插入文本', async () => {
    const data = []
    editor.setData(data)

    const dataRange: IDataRange = { startIndex: 0, endIndex: 0, startOffset: 0, endOffset: 0 }
    const newRange = editor._data.updateByRange(dataRange, [{ text: 'a' }])
    expect(editor._data.getData()).toStrictEqual([{ text: 'a' }])

    expect(newRange.endIndex).toBe(0)
    expect(newRange.endOffset).toBe(1)
  })

  it('文本末（外）插入文本', async () => {
    const data = [{ text: 'a' }]
    editor.setData(data)


    const dataRange: IDataRange = { startIndex: 1, endIndex: 1, startOffset: 1, endOffset: 1 }
    const newRange = editor._data.updateByRange(dataRange, [{ text: 'a' }])
    expect(editor._data.getData()).toStrictEqual([{ text: 'aa' }])

    expect(newRange.endIndex).toBe(0)
    expect(newRange.endOffset).toBe(2)

  })

  it('文本末（内）插入文本', async () => {
    const data = [{ text: 'a' }];
    editor.setData(data)

    const dataRange: IDataRange = { startIndex: 0, endIndex: 0, startOffset: 1, endOffset: 1 }
    const newRange = editor._data.updateByRange(dataRange, [{ text: 'a' }])
    expect(editor._data.getData()).toStrictEqual([{ text: 'aa' }])

    expect(newRange.endIndex).toBe(0)
    expect(newRange.endOffset).toBe(2)
  })

  it('文本中（内）插入文本', async () => {
    const data = [{ text: 'aa' }];
    editor.setData(data)

    const dataRange: IDataRange = { startIndex: 0, endIndex: 0, startOffset: 1, endOffset: 1 }
    const newRange = editor._data.updateByRange(dataRange, [{ text: 'b' }])
    expect(editor._data.getData()).toStrictEqual([{ text: 'aba' }])

    expect(newRange.endIndex).toBe(0)
    expect(newRange.endOffset).toBe(2)
  })


  it('文本中（内）插入双链', async () => {
    const data: IAtom[] = [{ text: "1" }, { type: "link", text: "tag" }];
    editor.setData(data)

    const dataRange: IDataRange = { startIndex: 0, endIndex: 0, startOffset: 0, endOffset: 0 }
    const newRange = editor._data.updateByRange(dataRange, [{ type: "link", text: "tag1" }])
    expect(editor._data.getData()).toStrictEqual([
      { type: "link", text: "tag1" },
      { text: "1" },
      { type: "link", text: "tag" }
    ])

    expect(newRange.endIndex).toBe(1)
    expect(newRange.endOffset).toBe(0)
  })

})
