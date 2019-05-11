import Vue from 'vue'
import App from './App.vue'
import 'iview/dist/styles/iview.css'
import store from './store'
import router from './router'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
