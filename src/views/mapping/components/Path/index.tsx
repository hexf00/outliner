import { Component, Prop, Vue } from 'vue-property-decorator'

export interface IView {
  x1: number
  y1: number
  x2: number
  y2: number
  isSeeSource: boolean
  isSeeTarget: boolean
  remove (): void
}

@Component
export default class Path extends Vue {
  declare $props: {
    service: IView
  }
  @Prop() service !: IView

  render () {
    const { x1, y1, x2, y2, isSeeSource, isSeeTarget } = this.service
    return <g>
      {isSeeSource ? <circle cx={x1} cy={y1} r="8"></circle> : <rect x={x1 - 5} y={y1 - 10} width={10} height={10}></rect>}
      <path class="line" d={`M ${x1} ${y1} L ${x2} ${y2}`} onclick={() => this.service.remove()}></path>
      {isSeeTarget ? <circle cx={x2} cy={y2} r="8"></circle> : <rect x={x2 - 5} y={y2 - 10} width={10} height={10}></rect>}
    </g>
  }
}
