import { Component, Prop, Vue } from 'vue-property-decorator'
import { OutlinerService } from './service'
import style from './index.module.scss'
import Block from './Block'
@Component
export default class Outliner extends Vue {
  declare $props: {
    service: OutlinerService
  }

  @Prop() service !: OutlinerService
  render () {
    const service = this.service
    return <div class={style.red}>
      <button onclick={() => console.log(service.stringifyPlain())}>toPlain</button>
      <button onclick={() => console.log(service.parsePlain(service.text))}>parsePlain</button>
      <textarea v-model={service.text}></textarea>
      {service.content.map(it => <Block key={it.key} service={it} />)}
    </div>
  }
}
