import { DirectiveOptions } from 'vue'
export const drag: DirectiveOptions = {
  inserted (el, binding) {
    const { value } = binding
    el.draggable = true

    const addClass = (e) => {
      el.classList.add('drag-active')
      if (value) {
        value.class && el.classList.add(value.class)
      }
    }
    const removeClass = (e) => {
      el.classList.remove('drag-active')
      if (value) {
        value.class && el.classList.remove(value.class)
      }
    }

    el.ondragstart = e => {
      // 拖拽物的标识
      if (value) {
        value.name && e.dataTransfer!.setData('obj', value.name)
        // hack:用于drop判断拖拽事件的类型
        value.class && e.dataTransfer!.setData(value.class, 'true')
      }
      addClass(e)
      e.stopPropagation()
    }
    el.ondragend = e => {
      removeClass(e)
    }
  },
  unbind (el) {
    el.draggable = false
    el.ondragstart = null
    el.ondragend = null
  }
}

export const drop: DirectiveOptions = {
  inserted (el, binding) {
    const { value } = binding
    el.setAttribute('dropable', 'true')

    const addClass = (e: DragEvent) => {
      el.classList.add('drag-hover')

      if (value) {
        // 与drag类型评判才添加对应的class
        if (value.class) {
          const classNames = !Array.isArray(value.class) ? [value.class] : value.class
          classNames.forEach(className => {
            if (e.dataTransfer?.types.includes(className)) {
              el.classList.add(className)
            }
          })
        }
      }
    }
    const removeClass = () => {
      el.classList.remove('drag-hover')
      if (value) {
        const classNames = !Array.isArray(value.class) ? [value.class] : value.class
        classNames.forEach(className => el.classList.remove(className))
      }
    }

    // 允许放置
    el.ondragover = (e: DragEvent) => {
      e.preventDefault()
      addClass(e)
    }
    el.ondragenter = (e: DragEvent) => {
      e.preventDefault()
      addClass(e)
    }
    el.ondragleave = e => {
      e.preventDefault()
      removeClass()
    }
    el.ondrop = e => {
      e.stopPropagation() // 不再派发事件。解决Firefox浏览器，打开新窗口的问题。
      e.preventDefault()
      removeClass()
    }
  },
  unbind (el) {
    el.removeAttribute('dropable')
    el.ondragover = null
    el.ondragenter = null
    el.ondragleave = null
    el.ondrop = null
  }
}
