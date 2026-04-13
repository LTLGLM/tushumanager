import Vue from 'vue'
import Vuex from 'vuex'
import user from "@/store/modules/user"
import cate from "@/store/modules/cate"
import getters from "@/store/getters"
import websocket from "@/store/modules/websocket"
Vue.use(Vuex)

export default new Vuex.Store({
  getters,
  modules: {
    user,
    cate,
    websocket
  }
})
