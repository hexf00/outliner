import { Component, Prop, Vue } from 'vue-property-decorator'
import HomeService from './service'
import $ from './index.module.scss'
import Point from '@/components/Point'
import ResizeDiv from '@/components/ResizeDiv'


@Component
export default class Home extends Vue {
  declare $refs: {
    left: ResizeDiv,
    right: ResizeDiv
  }
  declare $props: {
    service: HomeService
  }
  @Prop() service !: HomeService

  mounted () {
    const { left: list1, right: list2 } = this.service
    list1.setEl(this.$refs.left.$el)
    list2.setEl(this.$refs.right.$el)

    this.service.update()
  }

  render () {
    const { left, right } = this.service
    return <div class={$.component}>
      <div class={$.box}>
        <div class={$.left}>
          5435
          <ResizeDiv ref="left" onresize={(rect) => left.update()}>
            {Array(100).fill(0).map((_, i) => <div>{i}</div>)}
          </ResizeDiv>
        </div>
        <div class={$.right}>
          423423
          <ResizeDiv ref="right" onresize={(rect) => right.update()}>
            {Array(100).fill(0).map((_, i) => <div>{i}</div>)}
          </ResizeDiv>
        </div>
        <Point x={left.pos.x} y={left.pos.y} color="#f00" tooltip='getBoundingClientRect' />
        <Point x={right.pos.x} y={right.pos.y} color="#00f" tooltip='getBoundingClientRect' />

        <Point x={left.offset.x} y={left.offset.y} color="#f00" tooltip='offset' />
        <Point x={right.offset.x} y={right.offset.y} color="#00f" tooltip='offset' />
      </div>
    </div>
  }
}
