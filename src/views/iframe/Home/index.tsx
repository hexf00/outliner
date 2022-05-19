import { Component, Prop, Vue } from 'vue-property-decorator'
import Sheet from '../components/Sheet'
import HomeService from './service'

@Component
export default class Home extends Vue {
  declare $props: {
    service: HomeService
  }
  @Prop() service !: HomeService
  render () {
    const { sheet1, sheet2 } = this.service
    return (
      <div>
        <Sheet service={sheet1} />
        <Sheet service={sheet2} />
      </div>
    )
  }
}
