import Vue from 'vue'
import App from './App.vue'

import './style.less'
import { a } from './test'

Vue.config.productionTip = false

a()
new Vue({
  render: h => h(App)
}).$mount('#app')
