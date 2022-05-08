import { Component, Prop, Vue } from 'vue-property-decorator'
import Block, * as NBlock from '../Block'

export interface IView {
  children: NBlock.IView[]
}

@Component
export default class PageBlock extends Vue {
  declare $props: {
    service: IView
  }

  @Prop() service !: IView

  render () {
    const service = this.service
    return (
      <div>
        {service.children.map(it => <Block key={it.key} service={it} />)}
      </div >
    )
  }
}