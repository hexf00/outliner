import { Component, Prop, Vue } from 'vue-property-decorator';

import style from './index.module.scss';

export interface IAtom {
  type?: 'link' | 'space'
  text: string
}
export interface IEditor {
  msg: string
  data: IAtom[]
  beforeInput (e: InputEvent): void
  input (e: InputEvent): void
  keydown (e: KeyboardEvent): void
  setEl (el: HTMLElement): void

  elManger: {
    /** 挂载后才更新Dom选区 */
    mounted (): void
  }
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
    this.service.setEl(this.$refs.input)
    this.service.elManger.mounted()
    this.$once('hook:beforeDestroy', () => this.service.setEl(document.createElement('div')))
  }

  render () {
    const service = this.service
    return (
      <div>
        <div
          ref="input"
          class={style.textarea}
          contentEditable
          spellCheck="false"
          on={{
            input: (e: InputEvent) => service.input(e),
            beforeinput: (e: InputEvent) => service.beforeInput(e),
            keydown: (e: KeyboardEvent) => service.keydown(e)
          }}
        >
          {
            service.data.map((it, index) => {
              if (it.type === 'link') {
                return <span key={'link' + index} data-type="link" class={style.link} contentEditable="false">{it.text}</span>
              } else if (it.type === 'space') {
                return <span data-type="space"></span>
              }
              return it.text
            })
          }
        </div>
      </div>
    )
  }
}
