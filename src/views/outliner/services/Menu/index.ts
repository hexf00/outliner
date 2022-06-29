import BlockService from "@/components/Outliner/Block/service";

export default class Menu {
  data: BlockService | undefined = undefined

  setData (data: BlockService) {
    this.data = data
  }
}