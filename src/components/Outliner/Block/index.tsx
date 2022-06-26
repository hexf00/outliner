import classNames from 'classnames'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import style from './index.module.scss'
console.log('style', style)
export interface IView {
  bindFocus (fn: () => void): void
  unbindFocus (fn: () => void): void
  setHover (status: boolean): void
  setExpand (status: boolean): void
  isExpand: boolean
  children: IView[]
  content: string
  key: string
  isShowExpand: boolean
  mount (el: HTMLElement): void
  unmount (el: HTMLElement): void
}

@Component
export default class Block extends Vue {
  declare $props: {
    service: IView
  }

  declare $refs: {
    input: HTMLDivElement
  }

  @Prop() service !: IView


  /** hack:不知道为啥新增的节点只输入一个字符后失去焦点时调用setData后就会多一个字符 */
  @Watch('service.content')
  onContentChange () {
    this.$nextTick(() => {
      this.$refs.input.innerHTML = this.service.content
    })
  }

  // 说明: 为了引用唯一，销毁时要用
  focus () {
    const el = this.$refs.input
    const textNode = el.childNodes[0] as Text | undefined

    el.focus()

    const range = document.createRange()
    if (textNode) {
      range.setStart(textNode, textNode.length)
      range.setEnd(textNode, textNode.length)
    } else {
      range.setStart(el, 0)
      range.setEnd(el, 0)
    }

    const selection = document.getSelection()
    selection?.removeAllRanges()
    selection?.addRange(range)
  }

  mounted () {
    console.log('mounted', this.service.key)

    this.service.mount(this.$refs.input)
    this.service.bindFocus(this.focus)
  }
  beforeDestroy () {
    console.log('beforeDestroy', this.service.key)
    this.service.unmount(this.$refs.input)

    this.service.unbindFocus(this.focus)
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
          <div ref="input" class={style.input} contentEditable>
            {service.content}
          </div>
        </div>
        <div class={style.children}>
          {service.isExpand && service.children.map(it => <Block key={it.key} service={it} />)}
        </div>
      </div >
    )
  }
}