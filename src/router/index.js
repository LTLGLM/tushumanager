import Vue from 'vue'
import VueRouter from 'vue-router'
import { constantRoute } from './routes'
Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: constantRoute
})

// 修复 Vue Router 重复导航错误
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};
export default router
