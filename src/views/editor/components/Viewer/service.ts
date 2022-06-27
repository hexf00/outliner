import { Inject, Service } from 'ioc-di';
import Vue from 'vue';

import Callback from '@/services/Callback';
import OPManager from '@/views/outliner/services/OPManager';

import Data from '../../services/Data';
import { IAtom } from '../../types';
import { EditorService } from '../Editor/service';
import { IView } from './';

@Service()
export default class ViewerService implements IView {
  @Inject(EditorService) editor!: EditorService
  @Inject(Data) _data !: Data
  @Inject(OPManager) opManager!: OPManager


  data: IAtom[] = []

  _onSetData: Function | null = null


  el: HTMLElement | null = null

  onFocusCallbacks = new Callback<(el: HTMLElement) => void>()
  bindOnFocus (fn: (el: HTMLElement) => void) {
    return this.onFocusCallbacks.add(fn)
  }

  onBlurCallbacks = new Callback<() => void>()
  bindOnBlur (fn: () => void) {
    return this.onBlurCallbacks.add(fn)
  }

  mount (el: HTMLElement): void {
    this.el = el
  }

  unmount (el: HTMLElement): void {
    if (this.el === el) {
      this.el = null
    }
  }

  onFocus (el: HTMLElement): void {
    this.editor.mount(el)
    this.editor.setData(this.data)
    this._onSetData = this._data.onSetData(data => this.data = data)
    this.onFocusCallbacks.run(el)
  }

  onBlur (): void {
    this._onSetData?.()
    this.editor.unmount()
    this.editor.setData([])
    this.onBlurCallbacks.run()
  }


  focus () {
    Vue.nextTick(() => {
      const el = this.el!
      el.focus()

      const range = document.createRange()
      range.setStart(el, el.childNodes.length)
      range.setEnd(el, el.childNodes.length)
      const selection = document.getSelection()
      selection?.removeAllRanges()
      selection?.addRange(range)
    })
  }

  setData (data: IAtom[]) {
    this.data = data
  }

  linkClick (text: string): void {
    this.opManager.emit('linkClick', text)
  }
}