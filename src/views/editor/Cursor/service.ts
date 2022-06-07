import { Already, Inject, Service } from "ioc-di"
import El from "../services/El"

@Service()
export default class CursorService {
  x = 0
  y = 0


  @Inject(El) el !: El


  constructor () {
    this.init()
  }

  @Already
  init () {
    this.el.onSetEl(el => {
      el.addEventListener('focus', () => this.getSelectionXy(el))
      el.addEventListener('keyup', () => this.getSelectionXy(el))
      el.addEventListener('mouseup', () => this.getSelectionXy(el))
    })
  }


  /**
   * 通过输入焦点计算双链上下文菜单的位置
   */
  getSelectionXy (el: HTMLElement) {
    const range = window.getSelection()!.getRangeAt(0)
    const { x, y } = range.getBoundingClientRect()

    console.log('x,y', x, y, range)


    // console.log(pos)

    this.x = x
    this.y = y
  }
}