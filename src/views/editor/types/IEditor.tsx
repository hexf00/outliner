import { IAtom } from './IAtom';

export interface IEditor {
  msg: string;
  data: IAtom[];
  mount (el: HTMLElement): void;
  unmount (): void;
}
