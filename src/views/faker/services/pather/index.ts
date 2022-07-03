import { IAtom } from '@/views/editor/types';
import { IBlock } from './../../../../components/Outliner/types';
import BlockService from "@/components/Outliner/Block/service";
import { Service } from "ioc-di";

@Service()
export default class Pather {
  block: BlockService | null = null
  init (block: BlockService) {
    this.block = block
  }

  get (rule: { data: string }): IBlock | undefined {
    if (!this.block) throw Error('请添加block')

    //广度树遍历 block.children BFS
    const queue: IBlock[] = [this.block]
    const visited: IBlock[] = []
    while (queue.length) {
      const block = queue.shift()!

      if (this.eq(block.data, rule.data)) {
        return block
      }
      visited.push(block)
      block.children.forEach(child => {
        if (!visited.includes(child)) {
          queue.push(child)
        }
      })
    }
    return
  }

  eq (data: IAtom[], rule: string): boolean {
    return this.toText(data) === rule
  }

  toText (data: IAtom[]) {
    return data.map(it => it.text).join('')
  }
}