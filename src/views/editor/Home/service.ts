
import { Already, Inject, Service } from "ioc-di";
import { EditorService } from "../Editor/service";

@Service()
export default class HomeService {
  @Inject(EditorService) editor!: EditorService

  constructor () {
    this.init()
  }

  @Already
  init () {
    this.editor.setData([
      { text: "123" },
      { type: "link", text: "tag" },
      // { type: "space", text: "" },
      { type: "link", text: "tag" },
      { text: "456" },
      { type: "link", text: "tag" },
      // { type: "space", text: "" },
    ])
  }
}