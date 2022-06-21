import { DirectiveOptions } from 'vue'

import ResizeObserver from 'resize-observer-polyfill';


export const drag: DirectiveOptions = {
  inserted (el, binding) {
    const { expression } = binding

    el.ro = new ResizeObserver((entries, observer) => {
      const entry = entries.find(it => it.target === this.$el)
      if (entry) {
        const { left, top, width, height } = entry.contentRect
        this.$emit("resize", { left, top, width, height })
      }
    })

    el.ro.observe(this.$el)

    el.ondragend = e => {
      removeClass(e)
    }
  },
  unbind (el) {
    el.ondragend = null
  }
}