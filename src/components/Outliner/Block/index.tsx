import classNames from 'classnames'
import { Component, Prop, Vue } from 'vue-property-decorator'
import style from './index.module.scss'
console.log('style', style)
export interface IView {
  setHover (status: boolean): void
  setExpand (status: boolean): void
  isExpand: boolean
  children: IView[]
  content: string
  key: string
  isShowExpand: boolean
  mount (el: HTMLElement): void
  unmount (el: HTMLElement): void
  vueComponent: Vue.VueConstructor
}

@Component
export default class Block extends Vue {
  declare $props: {
    service: IView
  }

  declare $refs: {
    input: Vue
  }

  @Prop() service !: IView

  mounted () {
    this.service.mount(this.$refs.input.$el as HTMLElement)
  }
  beforeDestroy () {
    this.service.unmount(this.$refs.input.$el as HTMLElement)
  }

  render () {
    const service = this.service
    return (
      <div class={style.block}>
        <div class={style.text} on={{
          mouseover: () => service.setHover(true),
          mouseout: () => service.setHover(false)
        }}>
          <span class={classNames(
            style.expand,
            !service.isShowExpand && style.hide,
            !service.isExpand && style.close
          )} onclick={() => service.setExpand(!service.isExpand)}></span>
          <span class={classNames(style.bullet, !service.isExpand && style.close)}></span>
          <service.vueComponent ref="input" class={style.input} service={service} />
        </div>
        <div class={style.children}>
          {service.isExpand && service.children.map(it => <Block key={it.key} service={it} />)}
        </div>
      </div >
    )
  }
}