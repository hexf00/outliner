import { Component, Prop, Vue } from 'vue-property-decorator';
import { IAtom } from "../../types";

import style from './index.module.scss';

export interface IView {
  data: IAtom[]
  focus (el: HTMLElement): void
  blur (): void
}

@Component
export default class Viewer extends Vue {
  declare $props: {
    service: IView
  }

  declare $refs: {
    input: HTMLElement
  }

  @Prop() service !: IView

  render () {
    const service = this.service
    return (
      <div>
        <div
          ref="input"
          class={style.textarea}
          contentEditable
          spellCheck="false"
          onfocus={() => service.focus(this.$refs.input)}
          onblur={() => service.blur()}
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
