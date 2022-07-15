import PageBlock from '@/components/Outliner/PageBlock'
import { Component, Prop, Vue } from 'vue-property-decorator'
import Mapper from '../services/mapper'

export interface IView {
  mapper: Mapper
}

@Component
export default class Home extends Vue {
  declare $props: {
    service: IView
  }
  @Prop() service !: IView
  render () {
    const { mapper } = this.service
    return <div>
      <PageBlock service={mapper.editor} />
    </div>
  }
}
