import { Component, Prop, Vue } from 'vue-property-decorator'
import { OutlinerService } from './service'
import style from './index.module.scss'
import PageBlock from './PageBlock'
@Component
export default class Outliner extends Vue {
  declare $props: {
    service: OutlinerService
  }

  @Prop() service !: OutlinerService
  render () {
    const service = this.service
    const { pageBlock } = this.service
    return <div class={style.red}>
      <button onclick={() => service.stringifyPlain()}>toPlain</button>
      <button onclick={() => service.parsePlain(service.text)}>parsePlain</button>
      <textarea v-model={service.text}></textarea>
      <PageBlock service={pageBlock} />
    </div>
  }
}
