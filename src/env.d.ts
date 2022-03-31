declare module '*.module.scss' {
  const classes: { [key: string]: string }
  export default classes
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
