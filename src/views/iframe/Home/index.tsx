import { Component, Prop, Vue } from 'vue-property-decorator'
import Sheet from '../components/Sheet'
import HomeService from './service'
import $ from './index.module.scss'
import classNames from 'classnames'

@Component
export default class Home extends Vue {
  declare $props: {
    service: HomeService
  }
  declare $refs: {
    canvasContainer: HTMLElement
    canvas: HTMLCanvasElement
  }
  @Prop() service !: HomeService

  mounted () {
    const setCanvas = (canvas: HTMLCanvasElement) => {
      // console.warn('setCanvas', canvas)
      const container = this.$refs.canvasContainer
      // container.innerHTML = ''

      setTimeout(() => {
        container.appendChild(canvas)
      }, 10)
    }
    this.service.bindSetCanvas(setCanvas)
    this.$once('hook:beforeDestroy', () => {
      console.log('beforeDestroy')
      this.service.unbindSetCanvas(setCanvas)
    })

    const ctx = this.$refs.canvas.getContext('2d')!
    ctx.fillStyle = 'green'
    ctx.fillRect(0, 0, 100, 100)
    ctx.fillStyle = 'red'
    ctx.fillRect(100, 100, 100, 100)
  }

  render () {
    const { sheets } = this.service
    return (
      <div>
        <div>
          完整测试:
          <button onclick={() => this.service.toCanvas()}>toCanvas</button>
          <button onclick={() => this.service.toPDF()}>toPDF</button>

          iframe测试:
          <button onclick={() => this.service.iframeToCanvasDefault()}>iframeToCanvas(默认方式)</button>
          <button onclick={() => this.service.iframeToCanvasByContents()}>iframeToCanvas(content方式)</button>
          <button onclick={() => this.service.iframeToCanvas()}>divToCanvas(支持iframe，通过content方式)</button>
        </div>
        <div>
          <canvas ref="canvas" width="200" height="200" style="width: 200px;height: 200px;"></canvas>
        </div>
        <div ref="canvasContainer"></div>
        <div class={classNames($.pdfContainer, 'pdfContainer')}>
          {sheets.map((it, index) => (
            <div class={classNames($.card, 'card')}>
              <h2>第 {index + 1} 条名言</h2>
              <div class={classNames($.remove, 'remove')}>remove</div>
              <div class={$.content}>
                <Sheet service={it} />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
}
