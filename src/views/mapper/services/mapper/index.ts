import PageBlockService from "@/components/Outliner/PageBlock/service";
import Cache from "@/services/Cache";
import OPManager from "@/views/outliner/services/OPManager";
import { Already, Concat, Inject, Service } from "ioc-di";
import MapService from "../../services/map/map";
import Pather from "../pather";

@Service()
export default class Mapper {
  @Inject(OPManager) opManager!: OPManager
  @Inject(Pather) pather!: Pather
  @Inject(MapService) map !: MapService

  editor = Concat(this, new PageBlockService())

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

    this.cache.setKey('mapper_data')
    const data = await this.cache.get() || []
    this.editor.setData(data)
  }

  save () {
    this.text = this.editor.toPlain()
    const data = this.editor.getData()

    console.log(data)
    this.cache.set(data)
  }
}