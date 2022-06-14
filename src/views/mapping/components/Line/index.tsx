import { Component, Prop, Vue } from 'vue-property-decorator'

export interface IView {
  x1: number
  y1: number
  x2: number
  y2: number
}

@Component
export default class Path extends Vue {
  declare $props: {
    service: IView
  }
  @Prop() service !: IView

  render () {
    const { x1, y1, x2, y2 } = this.service
    return <g>
      <circle cx={x1} cy={y1} r="8"></circle>
      <path class="line" d={`M ${x1} ${y1} L ${x2} ${y2}`}></path>
      <circle cx={x2} cy={y2} r="8"></circle>
    </g>
  }
}
