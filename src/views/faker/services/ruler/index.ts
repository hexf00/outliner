import { Inject, Service } from "ioc-di";
import EnumHelper from "../enum";
import Pather from "../pather";

export interface IBaseRule {
  field: string
  type: 'inc' | 'enum' | 'rand'
}

export interface IIncRule extends IBaseRule {
  type: 'inc'
  start: number
}

export interface IEnumRule extends IBaseRule {
  type: 'enum'
  enum: string
  lv: number
}

export interface IRandRule extends IBaseRule {
  type: 'rand'
  min: number
  max: number
}

export type IRule = IIncRule | IEnumRule | IRandRule

@Service()
export default class Ruler {
  @Inject(Pather) pather!: Pather
  @Inject(EnumHelper) enumHelper!: EnumHelper


  /** 自增计数器 */
  inc = 0


  parse (rule: string): IRule {
    const [field, type] = rule.split(':')
    //解析函数语法（可多参数）
    // (fn)\((args)\) , 再按,分割 args
    const matches = type.match(/(.+?)\((.*?)\)/)
    if (matches) {
      const [_, fn, args] = matches
      if (fn === 'inc') {
        const rule: IIncRule = {
          field,
          type: 'inc',
          start: 0
        }
        return rule
      }

      if (fn === 'enum') {
        const [enumName, lv] = args.split(',')
        const rule: IEnumRule = {
          field,
          type: 'enum',
          enum: enumName,
          lv: lv ? Number(lv) : 0
        }
        return rule
      }

      if (fn === 'rand') {
        const [min, max] = args.split(',')
        const rule: IRandRule = {
          field,
          type: 'rand',
          min: Number(min),
          max: Number(max)
        }
        return rule
      }
    }

    throw Error('规则解析错误')
  }

  test (rule: IRule, seed: number, index = 0): string | number {
    if (rule.type === 'inc') {
      return index + rule.start
    }

    if (rule.type === 'enum') {

      const enumName = rule.enum
      const enumData = this.pather.get({ data: enumName })
      const lv = rule.lv
      if (!enumData) throw Error('没有找到枚举')

      const allPaths = this.enumHelper.getAllPath(enumData)

      const randIndex = seed % allPaths.length
      const path = allPaths[randIndex]

      // console.log('path', path)
      let currData = enumData
      for (let i = 0, l = lv; i <= l; i++) {
        const index = path[i]
        currData = currData.children[index]
        if (!currData) {
          throw Error('没有找到枚举')
        }
      }


      // 按层次来平均概率 不平滑
      // let currData = enumData
      // for (let i = 0, l = lv; i <= l; i++) {
      //   const randIndex = seed % currData.children.length
      //   currData = currData.children[randIndex]
      //   if (!currData) throw Error('没有找到枚举')
      // }

      return this.pather.toText(currData.data)
    }

    if (rule.type === 'rand') {
      const min = rule.min
      const max = rule.max
      return Math.floor(Math.random() * (max - min + 1)) + min
    }

    throw Error('规则解析错误')
  }
}