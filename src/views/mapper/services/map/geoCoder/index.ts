import EventEmitter from "@/services/EventEmitter"

export default class GeoCoder {
  geocoder: AMap.Geocoder | null = null
  emitter = new EventEmitter()

  onLoad (fn: () => void) {
    this.emitter.once('load', fn)
  }
  init () {
    AMap.plugin(['AMap.Geocoder'], () => {
      this.geocoder = new AMap.Geocoder({
        // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
        city: '深圳'
      })

      this.emitter.emit('load')
    })
  }

  getLocation (addr: string): Promise<any> {
    const geocoder = this.geocoder
    if (!geocoder) throw Error("未完成初始化")

    return new Promise((resolve, reject) => {

      geocoder.getLocation(addr, function (status, result) {
        // console.log(status, result)
        if (status === 'complete' && result.info === 'OK') {
          // result中对应详细地理坐标信息
          resolve(result)
        } else {
          reject(result)
        }
      })
    })
  }
}