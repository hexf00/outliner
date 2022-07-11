
import { Already, Service } from 'ioc-di';

import { IView } from '.';

@Service()
export default class HomeService implements IView {


  constructor () {
    this.init()
  }

  @Already
  init () {
  }
}