import { Component, Prop, Vue } from 'vue-property-decorator';

import PageBlock from '@/components/Outliner/PageBlock';

import Map from '../components/Map';
import Mapper from '../services/mapper';
import $ from './index.module.scss';

export interface IView {
  mapper: Mapper
}

@Component
export default class Home extends Vue {
  declare $props: {
    service: IView
  }
  @Prop() service !: IView
  render () {
    const { mapper } = this.service
    return <div class={$.box}>
      <PageBlock class={$.left} service={mapper.editor} />
      <Map class={$.right} service={mapper.map} />
    </div>
  }
}
