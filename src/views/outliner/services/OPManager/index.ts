import { Service } from 'ioc-di';

import BlockService from '@/components/Outliner/Block/service';
import Callback from '@/services/Callback';

/** 操作总线 */
@Service()
export default class OPManager {

  onChangeCallbacks = new Callback()

  emit (event: 'textChange'): void
  // emit (event: 'blockChange', service: BlockService): void
  emit (event: 'addBlock', service: BlockService): void
  emit (event: 'removeBlock', service: BlockService): void
  emit (event: 'moveBlock', service: BlockService): void
  emit (event: string, ...args: any[]) {
    this.onChangeCallbacks.run()
  }

  onChange (fn: () => void) {
    return this.onChangeCallbacks.add(fn)
  }
}