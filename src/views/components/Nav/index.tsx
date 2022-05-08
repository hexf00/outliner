import { Component, Vue } from 'vue-property-decorator'
import RouteLink from '../../../components/RouteLink'

@Component
export default class Nav extends Vue {
  render () {
    return <div style="display:flex;gap:5px;">
      <RouteLink to={{ path: '/outliner' }}>outliner</RouteLink>
      <RouteLink to={{ path: '/csv' }}>csv</RouteLink>
    </div>
  }
}
