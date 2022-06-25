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
  mount (el: HTMLElement): void
  unmount (): void
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
    this.service.mount(this.$refs.input)
  }

  beforeDestroy () {
    this.service.unmount()
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
