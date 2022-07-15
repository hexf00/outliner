
import { Already, Inject, Service } from 'ioc-di';

import { IView } from '.';
import Mapper from '../services/mapper';

@Service()
export default class HomeService implements IView {
  @Inject(Mapper) mapper!: Mapper

  constructor () {
    this.init()
  }

  @Already
  init () {
  }
}