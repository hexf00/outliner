import { IView } from ".";

export default class ListService implements IView {
  data: string[] = []
  setData (data: string[]) {
    this.data = data
  }
}