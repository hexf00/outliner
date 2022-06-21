
import { IRect } from '@/types';
import ResizeObserver from 'resize-observer-polyfill';
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class ResizeDiv extends Vue {
  declare $props: {
    ref?: string
    onresize?: (rect: IRect) => void
  }
  ro: null | ResizeObserver = null
  mounted () {
    this.ro = new ResizeObserver((entries, observer) => {
      const entry = entries.find(it => it.target === this.$el)
      if (entry) {
        const { left, top, width, height } = entry.contentRect
        this.$emit("resize", { left, top, width, height })
      }
    })

    this.ro.observe(this.$el)
  }
  beforeDestroy () {
    if (this.ro) {
      this.ro.unobserve(this.$el)
    }
  }
  render () {
    return <div>{this.$slots.default}</div>
  }
}

