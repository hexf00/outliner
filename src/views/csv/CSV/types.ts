// 只是复用目的
interface IOrderBase {
  address: string
  createAt: string
  email: string
  id: string
  ip: string
  name: string
  origin: string
  payInfo: string
  phone: string
  postCode: string
  postInfo: string
  postPrice: string
  user: string
}

export interface IOrderRaw extends IOrderBase {
  goodsPrice: string
  detail: string
}

export interface IGoodItem {
  /** 商品id */
  id: number
  /** 商品数量 */
  number: number
  /** 商品名称 */
  name: string
  /** 商品价格 */
  price: number
}

export interface IOrder extends IOrderBase {
  goodsPrice: number
  detail: IGoodItem[]
}

/** 字段配置 */
export interface IField {
  field: string
  isShow: boolean
}

export interface IGoodCalc {
  /** 商品id */
  id: number
  /** 商品名称 */
  name: string
  /** 商品销售总数量 */
  number: number
  /** 商品销售总价格 */
  price: number
  /** 销售数量、价格记录 */
  priceRecord: Record<number, number>
  /** 名称记录 */
  nameRecord: string[]
}