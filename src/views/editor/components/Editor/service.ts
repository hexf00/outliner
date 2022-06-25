import { Concat, Inject, Service } from 'ioc-di';

import EventManager from '@/services/EventManager';
import Data from '../../services/Data';
import El from '../../services/El';
import Drag from '../../services/handlers/drag';
import IME from '../../services/handlers/IME';
import Link from '../../services/handlers/link';
import Paste from '../../services/handlers/paste';
import Remove from '../../services/handlers/remove';
import LinkMenu from '../../services/LinkMenu';
import DomRange from '../../services/range/dom';
import LinkRange from '../../services/range/link';
import RangeManager from '../../services/range/manager';
import { IRange } from '../../types';
import { IHandler } from '../../types/IHandler';
import { IAtom, IEditor } from './index';

@Service()
export class EditorService implements IEditor {
  @Inject(El) elManger !: El
  @Inject(Data) _data !: Data

  // 需要在此初始化，测试用
  @Inject(DomRange) domRange!: DomRange

  @Inject(LinkRange) linkRange !: LinkRange
  @Inject(LinkMenu) linkMenu!: LinkMenu
  @Inject(RangeManager) ranger!: RangeManager
  @Inject(EventManager) events!: EventManager

  msg = '富文本编辑器'

  handlers: IHandler[] = [
    Concat(this, new IME()),
    Concat(this, new Remove()),
    Concat(this, new Link()),
    Concat(this, new Drag()),
    Concat(this, new Paste())
  ]

  get data () {
    return this._data.data
  }

  get contextMenu () {
    return this.linkMenu.contextMenu
  }

  mount (el: HTMLElement): void {
    this.elManger.mount(el)
    this.events.add(el, 'beforeinput', (e) => this.onBeforeInput(e as InputEvent))
    this.events.add(el, 'input', (e) => this.onInput(e as InputEvent))
    this.events.add(el, 'keydown', (e) => this.onKeyDown(e as KeyboardEvent))
    this.events.add(el, 'compositionstart', (e) => this.onCompositionStart(e as CompositionEvent))
    this.events.add(el, 'compositionend', (e) => this.onCompositionEnd(e as CompositionEvent))
  }

  unmount (): void {
    this.events.clear(this.elManger.getEl())
    this.elManger.unmount()
  }

  hideContextMenu () {
    this.contextMenu.hide()
  }

  onCompositionStart (e: CompositionEvent): void {
    this.ranger.update()
    this.handlers.forEach(it => it.onCompositionStart?.(e))
  }

  onCompositionEnd (e: CompositionEvent): void {
    this.ranger.update()
    this.handlers.forEach(it => it.onCompositionEnd?.(e))
  }

  onBeforeInput (e: InputEvent): void {
    console.warn('onBeforeInput', e.inputType, e)
    this.ranger.update()
    this.handlers.forEach(it => it.onBeforeInput(e))
  }

  onKeyDown (e: KeyboardEvent): void {
    // 改变焦点需要检查上下文菜单的展示状态
    // 此时光标还未变化，需要延迟下

    // console.log('keydown', e)

    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      // 禁止默认行为（光标改变到行首、行尾）
      e.preventDefault()
    }

    if (e.key === 'Enter') {
      e.preventDefault()
    }

    if (this.contextMenu.isShow) {
      setTimeout(() => {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
          this.checkLinkMenu()
        }
      })
    }
  }

  onInput (e: InputEvent): void {
    // console.warn('input', e)
    this.checkLinkMenu()
  }


  /** 获取选区开头、结束在data对应的位置 */
  getSelectionDataIndex (range: IRange) {
    const { index: startIndex } = this.domRange.getDataIndex({ el: range.startContainer, offset: range.startOffset })
    const { index: endIndex } = this.domRange.getDataIndex({ el: range.endContainer, offset: range.endOffset })

    if (startIndex === -1) {
      console.error('startContainer', range)
      throw Error('未能找到start节点')
    }
    if (endIndex === -1) {
      console.error('endContainer', range)
      throw Error('未能找到end节点')
    }

    return [startIndex, endIndex]
  }

  /** 如果焦点在根元素，有一些逻辑不一样 */
  isRoot (el: Node) {
    return this.elManger.getEl() === el
  }

  /** 输入光标是否在双链语法中 */
  isInLink (): boolean {

    // 判断光标是否位于[[]]中
    const range = window.getSelection()!.getRangeAt(0)
    const { startContainer, startOffset, endOffset } = range
    if (this.isRoot(startContainer)) {
      console.log('startContainer 是 容器')
      return false
    }

    const [startIndex, endIndex] = this.getSelectionDataIndex(range)
    //往左找[[ , 不能有]]
    let leftFlag = false
    let leftStr = ''


    let leftIndex = 0
    let leftOffset = 0

    for (let i = startIndex; i > -1; i--) {
      const text = i === startIndex
        ? this.data[i].text.slice(0, startOffset)
        : this.data[i].text
      leftStr = text + leftStr

      const index = leftStr.lastIndexOf('[[')
      if (index !== -1) {
        leftStr = leftStr.slice(index + 2)
        //找到 [[ 标识，判断是否已有结尾
        leftFlag = leftStr.indexOf(']]') === -1
        if (leftFlag) {
          leftOffset = this.data[i].text.indexOf('[[') + 2
          leftIndex = i
        }
        break
      }
    }

    console.log('leftFlag', leftFlag)
    if (!leftFlag) {
      return false
    }

    //往右找]] , 不能有[[
    let rightFlag = false
    let rightStr = ''


    let rightIndex = 0
    let rightOffset = 0

    for (let i = endIndex, l = this.data.length; i < l; i++) {
      const text = i === endIndex
        ? this.data[i].text.slice(endOffset)
        : this.data[i].text
      rightStr += text



      const index = rightStr.indexOf(']]')
      if (index !== -1) {
        rightStr = rightStr.slice(0, index)
        //找到 ]] 标识，判断是否已有开头
        // 说明：indexOf需要偏移，否则可能会读到其它组的 ]] 标识
        rightFlag = rightStr.indexOf('[[', endOffset) === -1
        if (rightFlag) {
          rightOffset = this.data[i].text.indexOf(']]', endOffset)
          rightIndex = i
        }
        break
      }
    }

    console.log('rightFlag', rightFlag)
    if (!rightFlag) {
      return false
    }

    //配置双链选区
    this.linkRange.setData({
      startIndex: leftIndex,
      startOffset: leftOffset - 2,
      endIndex: rightIndex,
      endOffset: rightOffset + 2
    })
    // 展示菜单
    this.linkMenu.openContextMenu()

    return true
  }

  checkLinkMenu () {
    if (this.isInLink()) {
      //显示双链菜单的逻辑放入了DataRange中，DataRange相当于是胶水层
    } else {
      this.hideContextMenu()
    }
  }

  setData (data: IAtom[]) {
    this._data.setData(data)
  }
}