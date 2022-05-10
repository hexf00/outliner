import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import style from './index.module.scss'

export interface IAtom {
  type?: 'link'
  text: string
}
export interface IEditor {
  msg: string
  data: IAtom[]
  beforeInput (e: InputEvent): void
  input (e: InputEvent): void
}

@Component
export default class Editor extends Vue {
  declare $props: {
    service: IEditor
  }

  @Prop() service !: IEditor

  render () {
    const service = this.service
    return (
      <div
        class={style.textarea}
        contentEditable
        oninput={(e: InputEvent) => {
          service.input(e)
        }}
      >
        {
          service.data.map((it, index) => {
            if (it.type === 'link') {
              return <div key={'link' + index} class={style.link} contentEditable="false">{it.text}</div>
            }
            return it.text
          })
        }
      </div>
    )
  }
}
