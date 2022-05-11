import classNames from 'classnames'
import { Component, Prop, Vue } from 'vue-property-decorator'
import { useStop } from '../../../utils/jsx/useStop'

import style from './index.module.scss'

export interface IItem {
  label: string
  /** 菜单文件夹不需要有 */
  callback?: () => void
  /** 是否展开，有children才需要有 */
  isExpand?: boolean
  /** 子菜单 */
  children?: IItem[]
  /** 是否禁用 */
  isDisabled?: boolean
}

/** 视图层依赖定义 */
export interface IView {
  itemClick (it: IItem): void
  /** 切换折叠状态 */
  switchExpand (it: IItem): void
  /** 是否显示 */
  isShow: boolean
  /** 显示位置 */
  pos: { top: string, left: string }
  /** 隐藏显示 */
  hide (): void
  /** 菜单项目 */
  items: IItem[]
  /** 销毁函数，释放资源 */
  destroy (): void
}

@Component
export default class ContextMenu extends Vue {
  declare $props: {
    service: IView
  }

  @Prop() service!: IView

  render (h: Vue.CreateElement) {
    const service = this.service

    return (
      <div
        v-show={service.isShow}
        class={classNames(style.contextMenu)}
        onClick={useStop(() => { })}
        style={service.pos}>
        {getList(service.items)}
      </div >
    )

    function getList (items: IItem[], level = 0) {
      return (<ul>
        {items.map(it => getItem(it, level))}
      </ul>)
    }

    function getItem (it: IItem, level = 0) {
      return (
        <li key={it.label}>
          <div class={classNames(style.title, it.isDisabled && style.disabled)}
            style={{ 'padding-left': 1 + level * 1.5 + 'em' }}
            onClick={useStop(() => service.itemClick(it))}>
            <div class={style.icon}>
              {hasChildren(it) && (
                <span class={classNames(style.expand, it.isExpand && style.open)}>^</span>
              )}
            </div>
            <span>{it.label}</span>
          </div>
          {(hasChildren(it) && it.isExpand) && getList(it.children, level + 1)}
        </li>
      )

      function hasChildren (it: IItem): it is IItem & { children: IItem[] } {
        return !!it.children?.length
      }
    }
  }
}
