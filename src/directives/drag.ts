import { DirectiveOptions } from 'vue'
export const drag: DirectiveOptions = {
  inserted (el, binding) {
    const { value } = binding
    el.draggable = true
    el.ondragstart = e => {
      // 拖拽物的标识
      e.dataTransfer!.setData('obj', value.name)
    }
  }
}

export const drop: DirectiveOptions = {
  inserted (el, binding) {
    el.setAttribute('dropable', 'true')
    // 允许放置
    el.ondragover = e => {
      e.preventDefault()
      el.classList.add('drag-hover')
    }
    el.ondragenter = e => {
      e.preventDefault()
      el.classList.add('drag-hover')
    }
    el.ondragleave = e => {
      e.preventDefault()
      el.classList.remove('drag-hover')
    }
    el.ondrop = e => {
      e.stopPropagation() // 不再派发事件。解决Firefox浏览器，打开新窗口的问题。
      e.preventDefault()
      el.classList.remove('drag-hover')
    }
  }
}
