import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { IBlock } from '../types'
import style from './index.module.scss'
console.log('style', style)
export interface IView {
  addNeighbor (): void
  toParentDown (): void
  toBeUpChild (): void
  tab (order: 'asc' | 'desc'): void
  setContent (text: string): void
  children: IView[]
  content: string
  key: string
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

  mounted () {
    // console.log('mounted')
    this.$refs.input.focus()
  }

  render () {
    const service = this.service
    return (
      <div class={style.block}>
        <div ref="input" contentEditable
          onkeydown={
            (e: KeyboardEvent) => {
              e.stopPropagation() // 阻止冒泡，只能在当前层级处理，不阻止就会每个父级都添加一个子节点

              // console.log('onkeydown', e.key, e)
              if (e.key === 'Enter') {
                e.preventDefault() // 阻止默认换行行为，会把dom变乱
                service.addNeighbor()
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
                service.tab('desc')
              } else if (e.key === 'ArrowDown') {
                service.tab('asc')
              }
            }
          }
          oninput={(e: InputEvent) => {
            console.log((e.target as HTMLElement).innerText)
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
        {service.children.map(it => <Block key={it.key} service={it} />)}
      </div >
    )
  }
}