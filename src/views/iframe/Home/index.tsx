import { Component, Prop, Vue } from 'vue-property-decorator'
import Sheet from '../components/Sheet'
import HomeService from './service'
import $ from './index.module.scss'

@Component
export default class Home extends Vue {
  declare $props: {
    service: HomeService
  }
  declare $refs: {
    canvasContainer: HTMLElement
  }
  @Prop() service !: HomeService

  mounted () {
    const setCanvas = (canvas: HTMLCanvasElement) => {
      console.warn('setCanvas', canvas)
      const container = this.$refs.canvasContainer
      container.innerHTML = ''

      container.appendChild(canvas)
    }
    this.service.bindSetCanvas(setCanvas)
    this.$once('hook:beforeDestroy', () => {
      console.log('beforeDestroy')
      this.service.unbindSetCanvas(setCanvas)
    })
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
          <button onclick={() => this.service.iframeToCanvas()}>iframeToCanvas(默认方式)</button>
          <button onclick={() => this.service.iframeToCanvasByContents()}>iframeToCanvas(content方式)</button>
          <button onclick={() => this.service.iframeToCanvasByInject()}>iframeToCanvas(注入方式)</button>
          <div ref="canvasContainer"></div>
        </div>

        <div class={$.pdfContainer}>
          {sheets.map((it, index) => (
            <div class={$.card}>
              <h2>第 {index + 1} 条名言</h2>
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
