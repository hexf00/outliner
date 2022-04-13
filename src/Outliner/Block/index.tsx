import classNames from 'classnames'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { IBlock } from '../types'
import style from './index.module.scss'
console.log('style', style)
export interface IView {
  addNeighbor (): void
  addNewChild (): void
  toParentDown (): void
  toBeUpChild (): void
  tab (order: 'next' | 'prev'): void
  setContent (text: string): void
  remove (): void
  bindFocus (fn: () => void): void
  unbindFocus (fn: () => void): void
  hasChildren (): boolean
  hasDown (): boolean
  isLv1 (): boolean
  setHover (status: boolean): void
  setExpand (status: boolean): void
  isExpand: boolean
  children: IView[]
  content: string
  key: string
  isShowExpand: boolean
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
    // console.log('mounted', this.service.key)
    this.service.bindFocus(this.focus)
  }
  beforeDestroy () {
    // console.log('beforeDestroy', this.service.key)
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
          <span class={classNames(style.bullet, !service.isExpand && style.close)}>
            <span></span>
          </span>
          <div ref="input" class={style.input} contentEditable
            onkeydown={
              (e: KeyboardEvent) => {
                e.stopPropagation() // 阻止冒泡，只能在当前层级处理，不阻止就会每个父级都添加一个子节点

                const text = (e.target as HTMLElement).innerText;
                // console.log('onkeydown', e.key, e)
                if (e.key === 'Enter') {
                  e.preventDefault() // 阻止默认换行行为，会把dom变乱
                  if (text === ''
                    && !service.hasDown()
                    && !service.isLv1()
                  ) {
                    service.toParentDown()
                  } else {
                    if (service.hasChildren()) {
                      service.addNewChild()
                    } else {
                      service.addNeighbor()
                    }
                  }
                }

                if (e.key === 'Backspace') {
                  if (text.length === 0) {
                    service.remove()
                  }
                }

                if (e.key === 'Tab') {
                  e.preventDefault() // 不改变焦点

                  if (e.shiftKey) {
                    service.toParentDown()
                  } else {
                    service.toBeUpChild()
                  }
                }

                if (e.key === 'ArrowUp') {
                  service.tab('prev')
                } else if (e.key === 'ArrowDown') {
                  service.tab('next')
                }
              }
            }
            oninput={(e: InputEvent) => {
              // console.log((e.target as HTMLElement).innerText)
              // 说明: 暂时不能在输入中改变service.content，会导致输入焦点丢失
              // service.setData((e.target as HTMLElement).innerText)
            }}
            onblur={(e: FocusEvent) => {
              // console.log('onblur', (e.target as HTMLElement).innerText)
              service.setContent((e.target as HTMLElement).innerText)
            }}
          >
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