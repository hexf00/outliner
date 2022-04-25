import BlockService from "../../Block/service";

export default class MenuBlockService extends BlockService {
  create () {
    return new MenuBlockService()
  }

  remove (): void {
    if (window.confirm('删除后不可撤销，是否删除文件？')) {
      super.remove()
    }
  }
}