
import { Container, Service } from "ioc-di";
import { IView } from ".";

// @ts-expect-error
import * as fsrs from 'fsrs.js';
import Cache from "@/services/Cache";

@Container()
@Service()
export default class HomeService implements IView {


  cache = new Cache()

  constructor () {

    this.cache.setKey('srs')


    this.init()

  }


  click (id: string, grade: 0 | 1 | 2): void {

    const card = this.cardData


    card.grade = grade
    // console.log(card, mode)
    const outputData = fsrs(card, grade, null)

    this.cardData = this.cardData
    this.cache.set(outputData.cardData)
  }

  cardData: any = { id: 'id' }

  async init () {


    this.cardData = await this.cache.get() || { id: 'id' };

    const grade = -1;//Grade `-1` means learn new card,and `0, 1, 2` means review old card.

    const outputData = fsrs(this.cardData, grade, null)//Return {cardData,globalData}. You can save this output data and use it as input data the next time you update grade.
    this.cardData = this.cardData
    this.cache.set(outputData.cardData)
  }
}