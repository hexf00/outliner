import ViewerService from '../components/Viewer/service';
import { Concat } from 'ioc-di';

import { Already, Inject, Service } from 'ioc-di';

import { EditorService } from '../components/Editor/service';
import RangeManager from '../services/range/manager';
import { IView } from './';

@Service()
export default class HomeService implements IView {
  @Inject(EditorService) editor!: EditorService
  @Inject(RangeManager) ranger!: RangeManager


  data = [
    Concat(this, new ViewerService()),
    Concat(this, new ViewerService())
  ]

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

    // this.editor.setData([
    //   {
    //     "text": "1"
    //   },
    //   // {
    //   //   "type": "link",
    //   //   "text": "2"
    //   // },
    //   {
    //     "text": "3"
    //   }
    // ])


  }
}