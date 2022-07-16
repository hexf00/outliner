declare module '*.module.scss' {
  const classes: { [key: string]: string }
  export default classes
}

//拓展window的属性 
declare interface Window {
}

declare namespace JSX {
  type Element = any

  interface IntrinsicElements { [key: string]: any }

  // 给组件增加属性
  interface IntrinsicAttributes {
    key?: string | number
    class?: string | string[]
    style?: string | string[]
    slot?: string
  }

  interface ElementAttributesProperty {
    // 配置JSX中属性类型检查
    $props: any
  }
}



// 高德地图
declare interface Window {
  _AMapSecurityConfig: {
    securityJsCode: string
  }
}

declare namespace AMap {
  class Geocoder {
    constructor (opts: { city: string }): void

    getLocation (addr: string, fn: (status: any, result: any) => void)
  }
}
