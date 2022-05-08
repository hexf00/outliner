import { Component, Prop, Vue } from 'vue-property-decorator'
import { CSVService } from './service'
@Component
export default class CSV extends Vue {
  declare $props: {
    service: CSVService
  }

  @Prop() service !: CSVService

  render () {
    const service = this.service
    return (
      <div>
        <div>
          选择要分析的文件(.csv):
          <input
            type="file"
            accept="text/csv"
            oninput={(e: InputEvent) => {
              const file = (e.target as HTMLInputElement).files?.[0]
              if (!file) return

              var reader = new FileReader();
              reader.readAsText(file)
              reader.onload = () => {
                service.parse(reader.result as string)
              }
            }} />
        </div>

        <div>
          日期范围:
          <input type="date" value={service.start} oninput={(e: InputEvent) => {
            service.start = (e.target as HTMLInputElement).value
            service.transform()
          }} />

          <input type="date" value={service.end} oninput={(e: InputEvent) => {
            service.end = (e.target as HTMLInputElement).value
            service.transform()
          }} />
        </div>

        <div>
          <div>Raw数据条目数:{service.rawData.length}</div>
          <div>数据条目数:{service.data.length}</div>
          <div>总金额:{service.priceCount}</div>
          <div>商品销售品类计数: {service.goodsList.length}</div>
        </div>

        <div>
          输出关注字段:
          {
            service.fields.map(it => (
              <label key={it.field}>
                <input type="checkbox" checked={it.isShow} oninput={(e: InputEvent) => {
                  it.isShow = (e.target as HTMLInputElement).checked
                  service.saveFields()
                }} />
                {it.field}
              </label>
            ))
          }
        </div>

        <button onclick={() => service.filterRaw()}>过滤</button>
        <button onclick={() => service.transform()}>结构展开</button>
        <button onclick={() => service.log()}>在控制台打印</button>
        <button onclick={() => service.downloadTemp()}>下载csv</button>
        <button onclick={() => service.exportGoods()}>导出商品分析结果</button>
      </div>
    )
  }
}
