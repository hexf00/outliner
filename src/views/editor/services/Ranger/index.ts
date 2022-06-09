import { Inject, Service } from 'ioc-di';

import Data from '../Data';
import El from '../El';
import DomRange from '../range/dom';

/** 将Range转换为DataRange */
@Service()
export default class Ranger {
  @Inject(Data) data!: Data
  @Inject(El) elManager!: El
  @Inject(DomRange) domRange!: DomRange
}