import { Component, Prop, Vue } from 'vue-property-decorator';
import { IAtom } from "../../types";

import $ from './index.module.scss';

export interface IView {
  data: IAtom[]
  onFocus (el: HTMLElement): void
  onBlur (): void
  mount (el: HTMLElement): void
  unmount (el: HTMLElement): void
  linkClick (text: string): void
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

  mounted () {
    this.service.mount(this.$refs.input)
  }
  beforeDestroy () {
    this.service.unmount(this.$refs.input)
  }

  render () {
    const service = this.service
    return (
      <div
        ref="input"
        contentEditable
        spellCheck="false"
        onfocus={() => service.onFocus(this.$refs.input)}
        onblur={() => service.onBlur()}
      >
        {
          service.data.map((it, index) => {
            if (it.type === 'link') {
              return <span key={'link' + index} onclick={() => service.linkClick(it.text)} data-type="link" class={$.link} contentEditable="false">{it.text}</span>
            } else if (it.type === 'space') {
              return <span data-type="space"></span>
            }
            return <span class={$.text} data-type="text">{it.text}</span>
          })
        }
      </div>
    )
  }
}
