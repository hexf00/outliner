import DirHandler, * as NDirHandler from '@/components/DirHandler'
import BlockService from '@/components/Outliner/Block/service'
import PageBlock from '@/components/Outliner/PageBlock'
import { Component, Prop, Vue } from 'vue-property-decorator'

export interface IView {
  dirHandler: NDirHandler.IView
  faker: {
    text: string
    rule: BlockService
    gen (): void
    // setData (rule: string): void
  }
}

@Component
export default class Home extends Vue {
  declare $props: {
    service: IView
  }
  @Prop() service !: IView
  render () {
    const { faker } = this.service
    return <div>
      <DirHandler service={this.service.dirHandler} />
      <button onclick={() => faker.gen()}>gen</button>

      <PageBlock service={faker.rule} />

      <textarea style="width:400px;height:400px" v-model={faker.text} readonly></textarea>
    </div>
  }
}
