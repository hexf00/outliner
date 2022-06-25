/**
 * @jest-environment jsdom
 */

import { EditorService } from "@/views/editor/components/Editor/service"
import { Concat, Root } from "ioc-di"


class Entry { }
const diRoot = diNew()
function diNew (Class: any = Entry, args?: any) {
  return new (Root()(Class))(args)
}

const editor = Concat(diRoot, new EditorService())
const el = document.createElement('div')
editor.mount(el)

describe('domRange转换为dataRange', () => {

  it('空', async () => {
    el.innerHTML = ``
    const domRange = {
      startContainer: el,
      startOffset: 0,
      endContainer: el,
      endOffset: 0,
    }
    const dataRange = editor.domRange.toDataRange(domRange)
    expect(dataRange).toStrictEqual({ startIndex: 0, startOffset: 0, endIndex: 0, endOffset: 0 })
  })

  it('文本节点开头', async () => {
    el.innerHTML = `1`
    const domRange = {
      startContainer: el.childNodes[0],
      startOffset: 0,
      endContainer: el.childNodes[0],
      endOffset: 0,
    }
    const dataRange = editor.domRange.toDataRange(domRange)
    expect(dataRange).toStrictEqual({ startIndex: 0, startOffset: 0, endIndex: 0, endOffset: 0 })
  })

  it('文本节点结尾', async () => {
    el.innerHTML = `1`
    const domRange = {
      startContainer: el.childNodes[0],
      startOffset: 1,
      endContainer: el.childNodes[0],
      endOffset: 1,
    }
    const dataRange = editor.domRange.toDataRange(domRange)
    expect(dataRange).toStrictEqual({ startIndex: 0, startOffset: 1, endIndex: 0, endOffset: 1 })
  })

})


describe('dataRange转换为domRange', () => {

  it('空', async () => {
    el.innerHTML = ``
    const range = {
      startIndex: 0,
      startOffset: 0,
      endIndex: 0,
      endOffset: 0,
    }
    const domRange = editor.domRange.toDomRange(range)

    expect(Object.is(domRange.startContainer, el)).toBe(true)
    expect(Object.is(domRange.endContainer, el)).toBe(true)
    expect(domRange.startOffset).toBe(0)
    expect(domRange.endOffset).toBe(0)
  })

  it('textNode内末尾', async () => {
    el.innerHTML = `1`
    const range = {
      startIndex: 0,
      startOffset: 1,
      endIndex: 0,
      endOffset: 1,
    }
    const domRange = editor.domRange.toDomRange(range)

    expect(Object.is(domRange.startContainer, el.childNodes[0])).toBe(true)
    expect(Object.is(domRange.endContainer, el.childNodes[0])).toBe(true)
    expect(domRange.startOffset).toBe(1)
    expect(domRange.endOffset).toBe(1)
  })

  it('textNode外末尾', async () => {
    el.innerHTML = `1`
    const range = {
      startIndex: 1,
      startOffset: 0,
      endIndex: 1,
      endOffset: 0,
    }
    const domRange = editor.domRange.toDomRange(range)

    expect(Object.is(domRange.startContainer, el)).toBe(true)
    expect(Object.is(domRange.endContainer, el)).toBe(true)
    expect(domRange.startOffset).toBe(1)
    expect(domRange.endOffset).toBe(1)
  })

  it('spanEl末尾', async () => {
    el.innerHTML = `<span data-type="text">12</span>`
    const range = {
      startIndex: 0,
      startOffset: 2,
      endIndex: 0,
      endOffset: 2,
    }
    const domRange = editor.domRange.toDomRange(range)

    expect(Object.is(domRange.startContainer, el.childNodes[0].childNodes[0])).toBe(true)
    expect(Object.is(domRange.endContainer, el.childNodes[0].childNodes[0])).toBe(true)
    expect(domRange.startOffset).toBe(2)
    expect(domRange.endOffset).toBe(2)
  })

})