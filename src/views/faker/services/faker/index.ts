import PageBlockService from "@/components/Outliner/PageBlock/service";
import Cache from "@/services/Cache";
import { saveAs } from "@/utils";
import OPManager from "@/views/outliner/services/OPManager";
import { stringify } from 'csv-stringify/browser/esm/sync';
import { Already, Concat, Inject, Service } from "ioc-di";
import Pather from "../pather";
import Ruler from "../ruler";

@Service()
export default class Faker {
  @Inject(OPManager) opManager!: OPManager
  @Inject(Pather) pather!: Pather
  @Inject(Ruler) ruler!: Ruler

  rule = Concat(this, new PageBlockService())

  text = ''

  cache = new Cache()

  constructor () {
    this.init()
  }

  @Already
  async init () {

    this.opManager.onChange(() => {


      this.save()
    })

    this.cache.setKey('faker_rule')
    const data = await this.cache.get() || []
    this.rule.setData(data)
  }

  save () {
    this.text = this.rule.toPlain()
    const data = this.rule.getData()

    console.log(data)
    this.cache.set(data)
  }


  gen () {
    this.pather.init(this.rule)
    const block = this.pather.get({ data: '字段' })
    if (!block) return

    const rules = block.children
      .map(it => this.pather.toText(it.data))
      .map(it => this.ruler.parse(it))


    const result = Array(10000).fill(0).map((_, index) => {
      /** 种子，取值中会用到 */
      const seed = Math.round(Math.random() * 1e9)
      return rules.map(it => {
        return this.ruler.test(it, seed, index)
      })
    })

    // console.log(rules, result)

    saveAs(
      new Blob(
        [stringify(result, {
          header: true,
          columns: rules.map(it => it.field)
        })],
        { type: 'text/csv;charset=utf-8' }
      ),
      'temp.csv'
    )
  }
}