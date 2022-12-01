import 'golden-layout/src/less/goldenlayout-base.less';
import 'golden-layout/src/less/goldenlayout-light-theme.less';

import { Component, Prop, Vue } from 'vue-property-decorator';

export interface IView {
  mount (el: HTMLElement): void;
  unmount (el: HTMLElement): void;
}

@Component
export default class Layout extends Vue {
  declare $props: {
    service: IView
  }

  @Prop() service!: IView

  mounted () {
    this.service.mount(this.$el as HTMLElement)
  }

  beforeDestroy () {
    this.service.unmount(this.$el as HTMLElement)
  }

  render () {
    return (
      <div> </div>
    )
  }
}
