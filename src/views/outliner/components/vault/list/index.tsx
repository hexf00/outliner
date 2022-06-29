import { Component, Prop, Vue } from 'vue-property-decorator';
import { IVaultMeta } from '@/views/outliner/types';
import Add, * as NAdd from '../add'
export interface IView {
  data: IVaultMeta[]
  isShowAdd: boolean
  showAdd (): void
  hideAdd (): void
  open (vault: IVaultMeta): void
  adder: NAdd.IView
  import (e: InputEvent): void
}
@Component
export default class List extends Vue {
  declare $refs: {
    file: HTMLInputElement
  }
  declare $props: {
    service: IView
  }
  @Prop() service !: IView
  render () {
    const service = this.service

    return <div>
      <button onclick={() => service.showAdd()}>添加</button>

      <button onclick={() => this.$refs.file.click()}>导入</button>
      <input ref="file" type="file" accept="text/json" oninput={(e: InputEvent) => {
        service.import(e)
        this.$refs.file.value = ''
      }} style="display:none;" />

      {service.isShowAdd && (
        <div>
          <Add service={service.adder} />
          <button onclick={() => service.hideAdd()}>取消</button>
        </div>
      )}

      <div>
        {service.data.map(it => <div onclick={() => service.open(it)}>{it.name}</div>)}
      </div>
    </div>
  }
}
