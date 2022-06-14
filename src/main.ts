import Vue from 'vue'
import App from './views/App'
import { drag, drop } from '@/directives/drag'

Vue.directive('drag', drag)
Vue.directive('drop', drop)

new Vue({
  render: h => h(App)
}).$mount('#app')