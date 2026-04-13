import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import './assets/icons/index'

// 引入css样式
import "@/assets/style/index.scss"

// 引入element插件
import elementUI from '@/components/element'
// 不引入图标库不显示
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(elementUI)

Vue.config.productionTip = false

// 引入全局组件
import GlobalComponent from './components'
Vue.use(GlobalComponent)

// 路由拦截器
import './permission' // permission control

// 引入防抖节流函数
import { Debounce, Throttle } from "@/utils/generalfunction"

// 全局过滤器
Vue.filter('dateFormat', function (value) {
  let date = new Date(value)
  let year = date.getFullYear()
  let month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
  let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
  let hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
  let minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
  let second = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
  return year + '-' + month + '-' + day + '' + " " + hour + ':' + minute + ':' + second
});

Vue.directive('focus', {
  inserted: function (el) {
    el.focus()
  }
})

Vue.prototype.$Debounce = Debounce
Vue.prototype.$Throttle = Throttle

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')



