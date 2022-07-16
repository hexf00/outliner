export default class GeoCoder {
  geocoder: AMap.Geocoder | null = null

  init () {
    AMap.plugin(['AMap.Geocoder'], () => {
      this.geocoder = new AMap.Geocoder({
        // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
        city: '深圳'
      })
    })
  }

  getLocation (addr: string) {
    if (!this.geocoder) throw Error("未完成初始化")

    this.geocoder.getLocation(addr, function (status, result) {
      console.log(status, result)
      if (status === 'complete' && result.info === 'OK') {
        // result中对应详细地理坐标信息
      }
    })
  }
}