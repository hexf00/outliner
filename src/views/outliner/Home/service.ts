
import { Inject, Service } from 'ioc-di';

import { EditorService } from '@/views/editor/components/Editor/service';

import { OutlinerService } from '../../../components/Outliner/service';

@Service()
export default class HomeService {
  @Inject(OutlinerService) outliner!: OutlinerService
  @Inject(EditorService) editor!: EditorService
}