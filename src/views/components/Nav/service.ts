import { INav } from ".";

export default class NavService implements INav {
  isOpen = false;

  open () {
    this.isOpen = true
  }

  close () {
    this.isOpen = false
  }
}