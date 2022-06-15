import { Component, Prop, Vue } from 'vue-property-decorator'
import Drag from '../../services/Drag'
import Sort from '../../services/Sort'
import { IRect, ISize } from '../../types'

export interface IView {
  data: string[]
  setPos (pos: IRect): void
  setItemSize (size: ISize): void
  setScrollTop (number: number): void
  /** 来源可以触发拖拽 */
  isSource: boolean
  /** 目标可以释放拖拽 */
  isTarget: boolean

  drag: Drag

  sort?: Sort
}

@Component
export default class List extends Vue {
  declare $props: {
    service: IView
  }
  @Prop() service !: IView

  mounted () {

    // console.log(this.$el, this.$el.clientHeight, this.$el.scrollTop)
    // console.log(this.$el, this.$el.clientHeight, this.$el.scrollTop)

    this.service.setPos(this.$el.getBoundingClientRect())
    this.service.setItemSize({
      // ...this.$el.children[0]?.getBoundingClientRect(),
      width: 223,
      height: 30
    })

    // temp1.childNodes[0].clientWidth
  }

  render () {
    const service = this.service
    const { sort } = service

    const directives: any[] = []

    if (this.service.isSource) {
      directives.push({ name: 'drag', value: { class: 'mapping' } })
    }
    if (this.service.isTarget || sort) {
      directives.push({ name: 'drop', value: { class: ['mapping', 'sort'] } })
    }


    return <div onScroll={(e) => { this.service.setScrollTop(e.target.scrollTop) }}>
      {
        this.service.data.map((it, index) => (
          <div key={index}
            {...{ directives }}
            on={{
              dragstart: (e: DragEvent) => {
                this.service.isSource && this.service.drag.start(e, it)
              },
              drag: (e: DragEvent) => {
                this.service.isSource && this.service.drag.move(e)
              },
              dragend: (e: DragEvent) => {
                this.service.isSource && this.service.drag.end(e)
              },
              drop: (e: DragEvent) => {
                this.service.isTarget && this.service.drag.drop(e, it)
              },
              dragover: (e: DragEvent) => {
                sort && sort.move(e, it)
              }
            }}>

            <div>
              {sort && <span v-drag={{ class: 'sort' }}
                ondragstart={(e: DragEvent) => sort.start(e, it)}
                // 说明：阻止父dom的拖拽事件，严谨一点
                ondrag={(e: DragEvent) => e.stopPropagation()}
                ondragend={(e: DragEvent) => { sort && sort.end(e); e.stopPropagation() }}
              >sort</span>}

              {it}
              <input type="text" />
            </div>
          </div>
        ))
      }
    </div>
  }
}
