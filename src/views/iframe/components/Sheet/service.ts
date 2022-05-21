
import { Service } from "ioc-di";
import { ISheet } from ".";

export default class SheetService implements ISheet {
  name = 'default'

  declare window: Window
  declare body: HTMLBodyElement

  init (el: HTMLIFrameElement): void {
    this.window = el.contentWindow!
    this.body = (el.contentDocument!.body as HTMLBodyElement)

    this.setHtml(`<h1>${this.name}</h1>`)
    this.style(`
      html,body{ margin:0;padding:0;height:100%;width:100%; }
      body{ 
        background-color: #f3f3f3;
        display:flex;
        flex-direction: column;
        justify-content: center; 
        align-items: center; 
      }
      h1{
        padding: 0.5em;
        // text-indent:2.5em;
        letter-spacing:0.25em;
      }
    `)

    // this.exec(`
    //   window.name = ${JSON.stringify(this.name)}
    //   console.log('iframe ${this.name} setName(): ', window.name)
    // `)
    // this.exec(`
    //   window.getWindow = top.getWindow
    //   console.log('iframe ${this.name} getName(): ', getWindow().name)
    // `)
  }

  setHtml (html: string) {
    this.body.innerHTML = html
  }

  exec (script: string) {
    const scriptEl = document.createElement('script')
    scriptEl.innerHTML = script
    this.body.appendChild(scriptEl)
  }
  style (style: string) {
    const styleEl = document.createElement('style')
    styleEl.innerHTML = style
    this.body.appendChild(styleEl)
  }

  setName (name: string) {
    this.name = name
  }
}