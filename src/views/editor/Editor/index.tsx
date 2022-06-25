import { Component, Prop, Vue } from 'vue-property-decorator';

import style from './index.module.scss';

export interface IAtom {
  type?: 'link' | 'space'
  text: string
}
export interface IEditor {
  msg: string
  data: IAtom[]
  onBeforeInput (e: InputEvent): void
  onCompositionStart (e: CompositionEvent): void
  onCompositionEnd (e: CompositionEvent): void
  onInput (e: InputEvent): void
  onKeyDown (e: KeyboardEvent): void
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
            input: (e: InputEvent) => service.onInput(e),
            beforeinput: (e: InputEvent) => service.onBeforeInput(e),
            keydown: (e: KeyboardEvent) => service.onKeyDown(e),
            compositionstart: (e: CompositionEvent) => service.onCompositionStart(e),
            // compositionupdate: (e: InputEvent) => { console.warn('compositionupdate', e); e.stopPropagation(); e.preventDefault(); },
            compositionend: (e: CompositionEvent) => service.onCompositionEnd(e)
          }}
        >
          {
            service.data.map((it, index) => {
              if (it.type === 'link') {
                return <span key={'link' + index} data-type="link" class={style.link} contentEditable="false">{it.text}</span>
              } else if (it.type === 'space') {
                return <span data-type="space"></span>
              }
              return <span data-type="text">{it.text}</span>
            })
          }
        </div>
      </div>
    )
  }
}
