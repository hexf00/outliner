import { Component, Prop, Vue } from 'vue-property-decorator';
import { IEditor } from '../../types/IEditor';

import style from './index.module.scss';

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
