import { Component, Prop, Vue } from 'vue-property-decorator'
import Drag from '../../services/Drag'
import { IRect, ISize } from '../../types'

export interface IView {
  data: string[]
  setPos (pos: IRect): void
  setItemSize (size: ISize): void
  setScrollTop (number: number): void
  drag: Drag
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

    const directives = []
    return <div onScroll={(e) => {
      this.service.setScrollTop(e.target.scrollTop)
    }}>
      {
        this.service.data.map((it, index) => (
          <div key={index} v-drop
            directives={directives}
            on={{
              dragstart: (e: DragEvent) => this.service.drag.start(e, it),
              drag: (e: DragEvent) => this.service.drag.move(e),
              dragend: (e: DragEvent) => this.service.drag.end(e),
              drop: (e: DragEvent) => this.service.drag.drop(e, it)
            }}>

            <div>
              <span v-drag={{ name: it }} >o</span>
              {it}
              <input type="text" />
              <span v-drag={{ name: it }} >o</span>
            </div>
          </div>
        ))
      }
    </div>
  }
}
