import { parse } from 'csv-parse/browser/esm/sync';
import { stringify } from 'csv-stringify/browser/esm/sync';

import dayjs from 'dayjs';
import { saveAs } from '../../../utils';
import { IOrder, IOrderRaw, IField, IGoodItem, IGoodCalc } from './types';


export class CSVService {

  rawData: IOrderRaw[] = []
  data: IOrder[] = []
  fields: IField[] = []

  /** 总金额 */
  priceCount = 0
  /** 起始日期 */
  start = '2020-01-01'
  end = dayjs().format('YYYY-MM-DD')

  parse (result: string) {
    this.rawData = parse(result, { columns: true });

    this.fields = this.recoveryFields(Object.keys(this.rawData[0]))
    console.log('加载成功')
  }

  filterRaw () {
    this.rawData = this.rawData.filter(this.filter.bind(this))
    console.log('过滤完成')
  }

  filter (it: IOrderRaw) {
    return dayjs(it.createAt).isAfter(dayjs(this.start))
      && dayjs(it.createAt).isBefore(dayjs(this.end))
  }

  transform () {
    this.data = this.rawData
      .filter(this.filter.bind(this))
      .map(it => {
        return {
          ...it,
          goodsPrice: Number(it.goodsPrice.replace("￥", "").trim()),
          detail: this.transformGoods(it.detail)
        }
      })


    this.calc()
    this.goodsCalc()

    console.log('结构展开完成')
  }

  transformGoods (raw: string): IGoodItem[] {
    const data = raw.split('|')

    try {
      const ids = data[1].split(',').slice(1)
      const numbers = data[2].split(',').slice(1)
      const names = data[3].split(',').slice(1)
      const prices = data[4].split(',').slice(1)

      return ids.map((it, index) => ({
        id: Number(it),
        number: Number(numbers[index]),
        name: names[index],
        price: Number(prices[index])
      }))
    } catch (error) {
      console.error(error)
      return []
    }
  }

  log () {
    const fields = this.fields.filter(it => it.isShow).map(it => it.field)
    console.log(this.data.map(it => {
      let obj = {}
      fields.forEach(name => {
        // @ts-ignore
        obj[name] = it[name]
      })
      return obj
    }))
  }

  downloadTemp () {
    saveAs(
      new Blob(
        [stringify(this.data, {
          header: true,
          columns: this.fields.filter(it => it.isShow).map(it => it.field)
        })],
        { type: 'text/csv;charset=utf-8' }
      ),
      'temp.csv'
    )
    console.log('保存成功')
  }

  /** 将配置存储到localStorage */
  saveFields () {
    localStorage.setItem('fields', JSON.stringify(this.fields))
  }

  calc () {
    let count = 0
    this.data.forEach((it) => {
      count += it.goodsPrice
    })
    this.priceCount = count
    console.log('总金额计算完成')
  }


  goodsList: IGoodCalc[] = []

  goodsCalc () {
    const goodsDict: Record<number, IGoodCalc> = {}

    this.data.forEach((order) => {

      order.detail.forEach(it => {
        if (!goodsDict[it.id]) {
          goodsDict[it.id] = {
            id: it.id,
            name: it.name,
            price: 0,
            number: 0,
            priceRecord: {},
            nameRecord: []
          }
        }

        const good = goodsDict[it.id]!

        good.number += it.number

        if (it.number > 1000) {
          console.warn('销售数量异动预警', order)
        }

        good.price += it.price * it.number

        if (good.priceRecord[it.price]) {
          good.priceRecord[it.price] += it.number
        } else {
          good.priceRecord[it.price] = it.number
        }

        if (good.name != it.name && !good.nameRecord.includes(it.name)) {
          good.nameRecord.push(it.name)
        }
      })


    })

    this.goodsList = Object.values(goodsDict)

    this.goodsList = this.goodsList.sort((a, b) => b.price - a.price)
    console.log('商品销售计算完成', this.goodsList)
  }


  exportGoods () {
    saveAs(
      new Blob(
        [stringify(this.goodsList, {
          header: true,
          columns: Object.keys(this.goodsList[0])
        })],
        { type: 'text/csv;charset=utf-8' }
      ),
      'goods.csv'
    )
    console.log('保存成功')
  }

  /** 恢复字段的配置 */
  recoveryFields (names: string[]) {
    const configRaw = localStorage.getItem('fields')
    const config: IField[] = configRaw ? JSON.parse(configRaw) : []

    return names.map(name => {
      const oldConfig = config.find(it => it.field === name)
      return { field: name, isShow: true, ...oldConfig }
    })
  }
}