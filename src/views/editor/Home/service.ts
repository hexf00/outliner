
import { Already, Inject, Service } from "ioc-di";
import { EditorService } from "../components/Editor/service";
import RangeManager from "../services/range/manager";

@Service()
export default class HomeService {
  @Inject(EditorService) editor!: EditorService
  @Inject(RangeManager) ranger!: RangeManager

  constructor () {
    this.init()
  }

  @Already
  init () {

    // const old = [
    //   { text: "123" },
    //   { type: "link", text: "tag" },
    //   // { type: "space", text: "" },
    //   { type: "link", text: "tag" },
    //   { text: "456" },
    //   { type: "link", text: "tag" },
    //   // { type: "space", text: "" },
    // ]

    this.editor.setData([
      {
        "text": "1"
      },
      // {
      //   "type": "link",
      //   "text": "2"
      // },
      {
        "text": "3"
      }
    ])


  }
}