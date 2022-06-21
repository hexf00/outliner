import { Component, Prop, Vue } from 'vue-property-decorator'
import $ from './index.module.scss'

@Component
export default class Point extends Vue {
  declare $props: {
    x: number,
    y: number,
    color?: string,
    tooltip?: string
  }
  @Prop({ type: Number, default: 0 }) x !: number
  @Prop({ type: Number, default: 0 }) y !: number
  @Prop({ type: String, default: '#000' }) color !: string
  @Prop({ type: String, default: '' }) tooltip !: string

  render () {
    const { tooltip, x, y, color } = this
    return (
      <div>
        <div class={$.x} style={{ left: x + 'px', top: y + 'px', background: color }}></div>
        <div class={$.y} style={{ left: x + 'px', top: y + 'px', background: color }}></div>
        <div class={$.tip} style={{ left: x + 'px', top: y + 'px', color: color }}>{tooltip}({Math.round(x)},{Math.round(y)})</div>
      </div >
    )
  }
}
