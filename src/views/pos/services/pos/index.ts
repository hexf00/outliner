import { IPos } from "@/types/IPos"

export default class Pos {
  el: HTMLElement | null = null

  pos: IPos = {
    x: -1,
    y: -1
  }

  offset: IPos = {
    x: -1,
    y: -1
  }

  setEl (el) {
    this.el = el
  }

  getBoundingClientRect () {
    if (this.el) {
      this.pos = this.el.getBoundingClientRect()
    } else {
      this.pos = {
        x: -1,
        y: -1,
      }
    }
  }

  getOffset () {
    if (this.el) {
      this.offset.x = this.el.offsetLeft
      this.offset.y = this.el.offsetTop
    } else {
      this.offset = {
        x: -1,
        y: -1,
      }
    }
  }


  update () {
    this.getBoundingClientRect()
    this.getOffset()

  }
}