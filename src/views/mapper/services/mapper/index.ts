import BlockService from "@/components/Outliner/Block/service";
import PageBlockService from "@/components/Outliner/PageBlock/service";
import Cache from "@/services/Cache";
import { IAtom } from "@/views/editor/types";
import OPManager from "@/views/outliner/services/OPManager";
import { Already, Concat, Destroy, Inject, Service } from "ioc-di";
import MapService from "../../services/map/map";
import Pather from "../pather";

const toPlain = (data: IAtom[]) => {
  return data.map(it => {
    if (it.type === 'link') {
      return `[[${it.text}]]`
    } else {
      return it.text
    }
  }).join('')
}

const isAddress = (block: BlockService) => toPlain(block.editor.data).includes('地址:')

const findAddressBlock = (block: BlockService): BlockService | undefined => {
  const childNodes = block.getChildren()
  for (const child of childNodes) {
    if (isAddress(child)) {
      return child
    } else {
      const result = findAddressBlock(child)
      if (result) return result
    }
  }
  return undefined
}

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

    this.opManager.on('focusBlock', async (block: BlockService) => {
      console.log('block', block)
      //找到地址节点

      //找法1: 找到工作节点，然后找工作节点下的地址节点

      const isRoot = (block: BlockService) => this.editor === block

      const findWorkBlock = (block: BlockService): BlockService => {
        const parent = block.getParent()
        if (!parent) throw Error('parent is null')
        if (isRoot(parent)) {
          return block
        } else {
          return findWorkBlock(parent)
        }
      }



      const marker = await this.addMarker(findWorkBlock(block))
      if (marker) {
        this.map.map?.setZoomAndCenter(13, marker.getPosition(), false); //同时设置地图层级与中心点
      }
    })

    this.opManager.onChange(() => {
      this.save()
    })

    this.cache.setKey('mapper_data')
    const data = await this.cache.get() || []
    this.editor.setData(data)



    this.map.onLoad(() => {
      this.editor.children.forEach(it => {
        this.addMarker(it)
      })
    })

  }


  addMarker (jobBlock: BlockService): Promise<AMap.Marker> | undefined {
    const addressBlock = findAddressBlock(jobBlock)

    if (addressBlock) {
      const address = toPlain(addressBlock.editor.data).replace('地址:', '').trim()

      if (address) {
        return this.map.markAddress(address, addressBlock.key)
      }
    }
  }

  save () {
    this.text = this.editor.toPlain()
    const data = this.editor.getData()

    console.log(data)
    this.cache.set(data)
  }

}