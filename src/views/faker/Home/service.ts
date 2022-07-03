
import { Already, Inject, Service } from 'ioc-di';

import Faker from '../services/faker';
import { IView } from '.';
import DirHandlerService from '@/components/DirHandler/service';

@Service()
export default class HomeService implements IView {
  @Inject(DirHandlerService) dirHandler !: DirHandlerService
  @Inject(Faker) faker !: Faker

  constructor () {
    this.init()
  }

  @Already
  init () {
    this.dirHandler.init('faker_save_handler')
  }
}