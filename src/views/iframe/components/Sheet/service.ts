
import { Service } from "ioc-di";
import { ISheet } from ".";

@Service()
export default class SheetService implements ISheet {
  name = 'default'

  declare window: Window
  declare body: HTMLBodyElement

  init (el: HTMLIFrameElement): void {
    this.window = el.contentWindow!
    this.body = (el.contentDocument!.body as HTMLBodyElement)

    this.setHtml(`<h1>${this.name}</h1>`)

    this.exec(`
      window.name = ${JSON.stringify(this.name)}
      console.log('iframe ${this.name} setName(): ', window.name)
    `)
    this.exec(`
      window.getWindow = top.getWindow
      console.log('iframe ${this.name} getName(): ', getWindow().name)
    `)
  }

  setHtml (html: string) {
    this.body.innerHTML = html
  }

  exec (script: string) {
    const scriptEl = document.createElement('script')
    scriptEl.innerHTML = script
    this.body.appendChild(scriptEl)
  }

  setName (name: string) {
    this.name = name
  }
}