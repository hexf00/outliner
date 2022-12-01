import { Modal } from 'ant-design-vue';
import GoldenLayout from 'golden-layout';
import { Concat, Inject, InjectRef, Service } from 'ioc-di';
import { cloneDeep } from 'lodash';
import { createApp, reactive, toRaw } from 'vue';

import { addReport, delReport } from '@/api/report/reports';
import moveSvg from '@/assets/icons/svg/move.svg';
import { DEFAULT_CHART, DEFAULT_DATA } from '@/pages/report/report/components/ChartsOption';
import ChartsService from '@/pages/report/report/dashboard/components/Charts/service';

import { IView } from '../../components/Layout';
import Panel from '../../components/Panel';
import Action from '../Action';
import Control from '../Control';
import Data from '../Data';
import PanelService from '../Panel';
import Tabs from '../Tabs';
import { router } from '@/router';

@Service()
export default class Layout implements IView {
  get isAllowMove () {
    return this.config.settings.reorderEnabled;
  }
  // @InjectRef(() => DashboardService) dashboard!: DashboardService;

  @Inject(Data) dataManager!: Data;
  @Inject('types') controls!: Control[];
  @Inject(Action) action!: Action;

  layout?: GoldenLayout = undefined;

  el?: HTMLElement;

  config = {
    settings: {
      //弹出图标
      showPopoutIcon: false,
      //最大化图标
      showMaximiseIcon: false,
      //显示头部
      hasHeaders: true,

      /** 是否显示stack的关闭按钮 */
      showCloseIcon: true,
      /** 是否允许改变布局 */
      reorderEnabled: true,
      // 选择tab标签栏
      // selectionEnabled:true,

      constrainDragToContaisner: false,
      popoutWholeStack: false,
      blockedPopoutsThrowError: true,
      closePopoutsOnUnload: false,
    },
    // 语言配置
    labels: {
      close: '关闭',
      maximise: '最大化',
      minimise: '最小化',
      popout: '新窗口打开',
    },
    // 边框尺寸等相关配置
    dimensions: {
      borderWidth: 8,
      minItemHeight: 100,
      minItemWidth: 100,
      headerHeight: 32,
      dragProxyWidth: 240,
      dragProxyHeight: 40,
    },
  };

  mount (el: HTMLElement): void {
    console.log('layout mount');
    document.body.style.overflow = 'hidden';

    this.el = el;

    this.update([]);

    if (el) {
      const resizeObserver = new ResizeObserver((entries) => {
        this.layout?.updateSize();
      });

      resizeObserver.observe(el);
    }

    this.action.mount();
  }

  unmount (el: HTMLElement): void {
    document.body.style.overflow = '';
    this.action.unmount();
  }

  update (layoutData: any[]) {
    this.action.setAction('load');
    console.log('update');
    const el = this.el;
    if (!this.el) {
      throw new Error('el is undefined');
    }

    // const service =;

    // const data = toRaw(this.data).reportDetailList?.value || [];

    const config = {
      ...this.config,
      content: layoutData,
    };

    this.layout?.destroy();

    const layout = (this.layout = new GoldenLayout(config, el));

    layout.registerComponent('example', function (container: any, glState: any) {
      console.log('example created');

      const service = ((props: any) => {
        if (props.service) {
          console.log('已有service', props.service);
          return props.service;
        }

        // 关键步骤，后续回显时需要改变组件类型
        // glState.props.service = service;

        // 说明：此处需要使用reactive，否则无法响应式更新
        const service = reactive(props.control.gen());
        container.setState({
          props: { service },
        });

        return service;
      })(glState.props);

      console.log('gen service', toRaw(service));

      const app = createApp(Panel, { service }).use(router);
      app.mount(container.getElement()[0]);
      // container.getElement().html(`<h2>${glState.label || 'default'}</h2>`);
    });

    console.log('layout', layout);

    this.controls.forEach((control) => {
      if (!control.el) return;
      layout.createDragSource(control.el, {
        // title: title,
        title: '组件',
        type: 'component',
        componentName: 'example',
        componentState: {
          props: {
            control,
            // service: Concat(
            //   toRaw(this),
            //   new ChartsService({
            //     item: it,
            //     index,
            //   }),
            // ),
          },
        },
      });
    });

    layout.on('componentCreated', function ({ container }: any) {
      console.log('componentCreated', arguments);

      // if(c)
      // container.setState({
      //   label: Math.random(),
      // });
    });

    // layout.on('initialised', function () {
    //   // 屏蔽stack的事件

    //   // @ts-expect-error
    //   const old = layout._$calculateItemAreas;
    //   // @ts-expect-error
    //   layout._$calculateItemAreas = function () {
    //     old.call(layout);

    //     // @ts-expect-error
    //     console.log(layout._itemAreas.map((it) => [it, it.contentItem.isStack]));

    //     // @ts-expect-error
    //     layout._itemAreas = layout._itemAreas
    //       .filter((it: any) => !(it.y2 - it.y1 === 20))
    //       .map((it: any) => {
    //         if (it.contentItem.isStack) {
    //           it.y1 = it.y1 + 30;
    //         }
    //         return it;
    //       });

    //     // @ts-expect-error
    //     console.log(layout._itemAreas.map((it) => [it, it.contentItem.isStack]));
    //   };
    // });

    // 删除拦截
    layout.on('tabCreated', async (tab: any) => {
      // if (!this.action.isSkipAction) {
      //   console.log('新窗口创建', tab.contentItem.config.componentName);
      // }

      const config = tab.contentItem.config;
      const service = config.componentState.props?.service;
      if (config.componentName === 'example') {
        if (service && service.isNew /** 新增图表 */) {
          // 需要把新图表的ID更新为后端的ID
          console.log('新图表被添加', service);
          this.action.setAction('add');
          const card = await addReport(this.dataManager.modelId);
          const list = toRaw(this.dataManager).reportDetailList.value;

          list.push({
            ...service.item,
            // 图ID
            id: card.id,
          });

          const newIndex = list.length - 1;

          service.setData({
            index: newIndex,
          });
          console.log('图表 index 被更新', service);

          // 更新layout数据
          this.tabs.current?.setData(layout.toConfig().content);

          // 保存
          this.dataManager.save();
          console.log('已有service', service, service.isNew);
        }
      }

      console.log('tabCreated');
      tab.header.controlsContainer
        .find('.lm_close')
        .off('click') // 解绑当前handler
        .click(() => {
          Modal.confirm({
            title: '确定要删除吗？',
            async onOk () {
              await service?.remove();
              tab.contentItem.remove();
            },
          });
        });

      setTimeout(() => {
        console.log('moveSvg', moveSvg);
        tab.header.tabsContainer.find('.lm_title').html(`<div><svg class="mr5" style="
              width: 1em;
              height: 1em;
              vertical-align: -0.15em;
              fill: currentColor;
              overflow: hidden;
              outline: none;
            " aria-hidden="true"><use xlink:href="#icon-move-handler"></use></svg>移动</div>`);
      });
    });
    layout.on('stackCreated', (stack: any) => {
      // eslint-disable-next-line func-names
      stack._$highlightDropZone = function (x: number, y: number) {
        // override to not drop tabss
        let area: any = {};
        Object.keys(this._contentAreaDimensions).forEach((segment) => {
          area = this._contentAreaDimensions[segment].hoverArea;
          if (area.x1 < x && area.x2 > x && area.y1 < y && area.y2 > y) {
            if (segment !== 'header') {
              this._resetHeaderDropZone();
              this._highlightBodyDropZone(segment);
            }
          }
        });
      };
    });

    layout.init();
    layout.on('stateChanged', () => {
      // console.log('this._isLeftDown', this._isLeftDown);
      if (this.action.inOperation) {
        return;
      }
      if (this.action.isSkipAction) {
        return;
      }
      this.action.setAction('save');
      console.warn('stateChanged', layout, arguments);

      // if (!this.action.inOperation && !this.action.inOperation) {
      //   console.warn('save', layout.toConfig().content);
      // }

      this.tabs.current?.setData(layout.toConfig().content);

      this.dataManager.save();
      // this.data.dataManager =
    });
  }

  // addDragSource(){
  //   this.layout?.createDragSource(this.el, {
  // }
}
