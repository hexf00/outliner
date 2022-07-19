import { Destroy, Service } from 'ioc-di';

import BlockService from '@/components/Outliner/Block/service';
import Callback from '@/services/Callback';
import EventEmitter from '@/services/EventEmitter';

/** 操作总线 */
@Service()
export default class OPManager extends EventEmitter {

  onChangeCallbacks = new Callback()

  onLinkClickCallbacks = new Callback<(text: string) => void>()


  emit (event: 'textChange'): void
  // emit (event: 'blockChange', service: BlockService): void
  emit (event: 'addBlock', block: BlockService): void
  emit (event: 'removeBlock', block: BlockService): void
  emit (event: 'moveBlock', block: BlockService): void
  emit (event: 'linkClick', text: string): void
  emit (event: 'focusBlock', block: BlockService): void
  emit (event: string, ...args: any[]) {
    if (event === 'textChange'
      || event === 'blockChange'
      || event === 'addBlock'
      || event === 'removeBlock'
      || event === 'moveBlock') {
      this.onChangeCallbacks.run()
    }

    if (event === 'linkClick') {
      this.onLinkClickCallbacks.run(args[0])
    }

    if (event === 'focusBlock') {
      //TODO:
      super.emit(event, args[0])
    }
  }

  onChange (fn: () => void) {
    return this.onChangeCallbacks.add(fn)
  }

  onLinkClick (fn: (text: string) => void) {
    return this.onLinkClickCallbacks.add(fn)
  }

  @Destroy
  destroy () {
    this.onChangeCallbacks.destroy()
    this.onLinkClickCallbacks.destroy()
    this.off()
  }
}