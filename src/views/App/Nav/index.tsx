import classNames from 'classnames'
import { Component, Vue } from 'vue-property-decorator'
import RouteLink from '../../../components/RouteLink'
import NavService from './service'
import style from './style.module.scss'


export interface INav {
  isOpen: boolean
  open (): void
  close (): void
}

@Component
export default class Nav extends Vue {
  service: INav = new NavService()
  render () {
    const service = this.service
    return service.isOpen
      ? (
        <div class={classNames(style.nav)}>
          <button onclick={() => service.close()}>收起菜单</button>
          <div class={style.list}>
            <RouteLink to={{ name: 'outliner' }}>大纲编辑器</RouteLink>
            <RouteLink to={{ name: 'csv' }}>CSV数据分析</RouteLink>
            <RouteLink to={{ name: 'explorer' }}>文件API</RouteLink>
            <RouteLink to={{ name: 'editor' }}>富文本编辑器</RouteLink>
            <RouteLink to={{ name: 'iframe' }}>iframe测试</RouteLink>
            <RouteLink to={{ name: 'images' }}>images(裁剪、缩放、ocr)</RouteLink>
            <RouteLink to={{ name: 'jsplumb' }}>jsplumb 拖拽映射列表</RouteLink>
            <RouteLink to={{ name: 'mapping' }}>mapping</RouteLink>
            <RouteLink to={{ name: 'pos' }}>pos</RouteLink>
            <RouteLink to={{ name: 'faker' }}>faker</RouteLink>
            <RouteLink to={{ name: 'mapper' }}>mapper</RouteLink>
          </div>
        </div>
      )
      : (
        <div class={classNames(style.nav)}>
          <button onclick={() => service.open()}>展开菜单</button>
        </div>
      )
  }
}
