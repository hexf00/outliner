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
    const { menuBlock, pageBlock } = this.service
    return <div>
      <button onclick={() => service.stringifyPlain()}>toPlain</button>
      <button onclick={() => service.parsePlain(service.text)}>parsePlain</button>
      <textarea v-model={service.text}></textarea>

      <div class={style.fx}>
        <PageBlock class={style.menu} service={menuBlock} />
        <PageBlock class={style.content} service={pageBlock} />
      </div>
    </div>
  }
}
