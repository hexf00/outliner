import { Component, Vue } from 'vue-property-decorator'
import RouteLink from '../../../components/RouteLink'

@Component
export default class Nav extends Vue {
  render () {
    return <div style="display:flex;gap:5px;">
      <RouteLink to={{ name: 'outliner' }}>outliner</RouteLink>
      <RouteLink to={{ name: 'csv' }}>csv</RouteLink>
      <RouteLink to={{ name: 'explorer' }}>explorer</RouteLink>
    </div>
  }
}
