import { Inject, Service } from 'ioc-di';
import Data from '../../services/Data';
import { IAtom } from "../../types";
import { EditorService } from '../Editor/service';
import { IView } from './';

@Service()
export default class ViewerService implements IView {
  @Inject(EditorService) editor!: EditorService
  @Inject(Data) _data !: Data

  data: IAtom[] = []

  _onSetData: Function | null = null

  focus (el: HTMLElement): void {
    this.editor.mount(el)
    this.editor.setData(this.data)
    this._onSetData = this._data.onSetData(data => this.data = data)
  }

  blur (): void {
    this._onSetData?.()
    this.editor.unmount()
    this.editor.setData([])
  }

  setData (data: IAtom[]) {
    this.data = data
  }
}