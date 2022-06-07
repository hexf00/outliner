import { Component, Prop, Vue } from 'vue-property-decorator'


/** 视图层依赖定义 */
export interface IView {
  x: number,
  y: number
}

@Component
export default class Cursor extends Vue {
  declare $props: {
    service: IView
  }

  @Prop() service!: IView

  render () {
    const { x, y } = this.service
    return <div style="position: absolute;top: 0;">
      <div class="cursor" style={{
        height: '16px',
        top: y + 'px',
        left: x + 'px',
        'line-height': '16px',
        'letter-spacing': '0px',
        display: 'block',
        width: '2px',
        background: '#333',
        position: 'absolute'
      }}></div >
    </div>
  }
}