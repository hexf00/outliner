import EventEmitter from "@/services/EventEmitter";
import { loadScript } from "@/utils/dom";
import { Inject, Service } from "ioc-di";
import { IView } from "../../../components/Map";
import GeoCoder from "../geoCoder";


@Service()
export default class MapService implements IView {

  @Inject(GeoCoder) geoCoder!: GeoCoder

  declare map: AMap.Map


  emitter = new EventEmitter()

  onLoad (fn: () => void) {
    this.emitter.once('load', fn)
  }

  async mount (el: HTMLElement) {

    window._AMapSecurityConfig = {
      securityJsCode: 'e4b1d13d61048b32af0475d013522d0c',
    }

    const key = 'fb34c1bcb6a0492c535e2d714ce7a29f'
    const url = `https://webapi.amap.com/maps?v=1.4.15&key=${key}`;

    await loadScript(url)
    const map = new AMap.Map(el);

    this.map = map;

    this.geoCoder.onLoad(() => {
      this.emitter.emit('load')
    })

    this.geoCoder.init();
  }

  markers: Record<string, AMap.Marker> = {}

  async markAddress (address: string, key: string): Promise<AMap.Marker> {

    const oldMarker = this.markers[key]

    if (oldMarker) {
      //TODO: 实现修改
      return oldMarker
    }


    const result = await this.geoCoder.getLocation(address)

    const addr = result.geocodes[0]

    if (!addr) {
      throw Error('未找到该地址的经纬度信息')
    }

    const { formattedAddress, location } = addr
    console.log(formattedAddress, location.lat, location.lng)


    // 自定义点标记内容
    var markerContent = document.createElement("div");

    // 点标记中的图标
    var markerImg = document.createElement("img");
    markerImg.className = "markerlnglat";
    markerImg.src = "//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-red.png";
    markerContent.appendChild(markerImg);

    // 点标记中的文本
    var markerSpan = document.createElement("span");
    markerSpan.className = 'marker';
    markerSpan.innerHTML = formattedAddress;
    markerContent.appendChild(markerSpan);


    const marker = new AMap.Marker({
      // icon: "//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
      position: [location.lng, location.lat],
      content: markerContent,
      offset: new AMap.Pixel(-12, -34)
    });

    this.markers[key] = marker



    // marker.setContent(markerContent); //更新点标记内容
    // marker.setPosition([116.391467, 39.927761]); //更新点标记位置

    marker.setMap(this.map);

    return marker
  }

  unmount () {

  }
}