import VaultManager from "@/views/outliner/services/VaultManager";
import { InjectRef, Service } from "ioc-di";
import { IView } from ".";

@Service()
export default class AddService implements IView {

  @InjectRef(() => VaultManager) vaults!: VaultManager

  name: string = ''
  msg: string = ''

  submit (): void {
    if (!this.name.trim()) {
      this.msg = '请输入名称'
      return
    }
    this.msg = ''


    if (this.vaults.data.find(it => it.name === this.name)) {
      this.msg = '名称已存在'
      return
    }

    this.vaults.add({ name: this.name })

    this.name = ''
  }
}