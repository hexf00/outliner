
// import html2canvas from "html2canvas";
import { Service } from "ioc-di";
import Callback from "../../../services/Callback";
import SheetService from "../components/Sheet/service";
import { html2canvas } from "../utils/html2canvas";
import { MaoQuotations } from "./data";

declare global {
  interface Window {
    getWindow: any
  }
}
@Service()
export default class HomeService {

  sheets: SheetService[] = []

  setCanvasCallback = new Callback<(el: HTMLCanvasElement) => void>()

  constructor () {

    this.sheets = MaoQuotations.map(it => {
      const sheet = new SheetService();
      sheet.setName(it)
      return sheet
    })

    this.initGlobalFn()
  }

  bindSetCanvas (fn: (el: HTMLCanvasElement) => void) {
    this.setCanvasCallback.add(fn)
  }
  unbindSetCanvas (fn: (el: HTMLCanvasElement) => void) {
    this.setCanvasCallback.remove(fn)
  }

  setCanvas (canvas: HTMLCanvasElement) {
    this.setCanvasCallback.run(canvas)
  }

  initGlobalFn () {
    window.name = 'home'
    window.getWindow = function () {
      return window
    }
  }


  toCanvas () {
    throw new Error('Method not implemented.');
  }
  toPDF () {
    throw new Error('Method not implemented.');
  }
  iframeToCanvasDefault () {
    const el = document.querySelector('iframe')

    if (!el) throw Error('未找到iframe')

    html2canvas(el).then(canvas => {
      console.log('iframe:', el, 'canvas:', canvas)
      this.setCanvas(canvas)
    })
  }
  iframeToCanvasByContents () {
    const el = document.querySelector('iframe')

    if (!el) throw Error('未找到iframe')

    const body = el.contentDocument?.body
    if (!body) throw Error('未找到iframe body')

    html2canvas(body).then(canvas => {
      console.log('iframe body:', body, 'canvas:', canvas)
      this.setCanvas(canvas)
    })
  }
  async iframeToCanvas () {
    const el = document.querySelector('.pdfContainer')
    if (!el) throw Error('未找到pdfContainer')
    const canvas = await html2canvas(el as HTMLElement)
    // console.log('iframe:', el, 'canvas:', canvas)
    this.setCanvas(canvas)
  }
}