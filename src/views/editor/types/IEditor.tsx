import * as NContextMenu from '../ContextMenu';
import { IAtom } from './IAtom';

export interface IEditor {
  msg: string
  data: IAtom[]
  contextMenu: NContextMenu.IView
  mount (el: HTMLElement): void
  unmount (): void
}
