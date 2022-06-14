import { Inject, InjectRef, Service } from 'ioc-di';

import { IView } from '../../components/Canvas';
import { IRect } from '../../types';
import Drag from '../Drag';
import LineService from '../Line/service';

@Service()
export default class CanvasService implements IView {
  paths: LineService[] = []
  @InjectRef(() => Drag) tip !: Drag

  pos: IRect = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  }

  setPos (pos: IRect) {
    this.pos = pos

    this.rerender()
  }

  rerender () {
    this.paths.forEach(path => {
      path.calc()
    })
  }
}