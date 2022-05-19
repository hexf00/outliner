
import { Service } from "ioc-di";
import SheetService from "../components/Sheet/service";

declare global {
  interface Window {
    getWindow: any
  }
}
@Service()
export default class HomeService {
  sheet1 = new SheetService()
  sheet2 = new SheetService()
  constructor () {
    this.sheet1.setName('sheet1')
    this.sheet2.setName('sheet2')

    this.initGlobalFn()
  }

  initGlobalFn () {
    window.name = 'home'
    window.getWindow = function () {
      return window
    }
  }
}