import { IAtom } from '@/views/editor/types';

/** 数据层 */
export interface IBlock {
  key: string
  data: IAtom[]
  children: IBlock[]
}