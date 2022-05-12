import { Component, Prop, Vue } from 'vue-property-decorator'
import style from './index.module.scss'

export interface IAtom {
  type?: 'link'
  text: string
}
export interface IEditor {
  el: HTMLElement
  msg: string
  data: IAtom[]
  beforeInput (e: InputEvent): void
  input (e: InputEvent): void
  keydown (e: KeyboardEvent): void
}

@Component
export default class Editor extends Vue {
  declare $props: {
    service: IEditor
  }

  declare $refs: {
    input: HTMLElement
  }

  @Prop() service !: IEditor

  mounted () {
    this.service.el = this.$refs.input
    this.$once('hook:beforeDestroy', () => this.service.el = document.createElement('div'))
  }

  render () {
    const service = this.service
    return (
      <div
        ref="input"
        class={style.textarea}
        contentEditable
        on={{
          input: (e: InputEvent) => service.input(e),
          beforeinput: (e: InputEvent) => service.beforeInput(e),
          keydown: (e: KeyboardEvent) => service.keydown(e)
        }}
      >
        {
          service.data.map((it, index) => {
            if (it.type === 'link') {
              return <span key={'link' + index} class={style.link} contentEditable="false">{it.text}</span>
            }
            return it.text
          })
        }
      </div>
    )
  }
}
