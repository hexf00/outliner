import { loadScript } from "@/utils/dom";
import { Inject, Service } from "ioc-di";
import { IView } from "../../../components/Map";
import GeoCoder from "../geoCoder";


@Service()
export default class MapService implements IView {

  @Inject(GeoCoder) geoCoder!: GeoCoder

  async mount (el: HTMLElement) {

    window._AMapSecurityConfig = {
      securityJsCode: 'e4b1d13d61048b32af0475d013522d0c',
    }

    const key = 'fb34c1bcb6a0492c535e2d714ce7a29f'
    const url = `https://webapi.amap.com/maps?v=1.4.15&key=${key}`;

    await loadScript(url)
    const map = new AMap.Map(el);
    console.log(map)

    this.geoCoder.init();
  }

  unmount () {

  }
}