import { Component, Prop, Vue } from 'vue-property-decorator';
import { IAtom } from "../../types";

import style from './index.module.scss';

export interface IView {
  data: IAtom[]
  onFocus (el: HTMLElement): void
  onBlur (): void
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
      <div
        ref="input"
        class={style.textarea}
        contentEditable
        spellCheck="false"
        onfocus={() => service.onFocus(this.$refs.input)}
        onblur={() => service.onBlur()}
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
    )
  }
}
