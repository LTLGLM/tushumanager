import { Message } from "element-ui";
import router from "./router";
import store from "./store"
import { handlerRouter } from "./utils/routerhandle";
import { GET_SESSION_KEY, REMOVE_SESSION_KEY } from "./utils/sessionStorage";
import nprogress from "nprogress";
import 'nprogress/nprogress.css'

// 免登录白名单
const whileList = ["/login"]
router.beforeEach((to, from, next) => {
    const token = store.getters.token || GET_SESSION_KEY("Token")

    if (token) {
        if (to.path === "/login") {
            next({ path: '/home' })
        } else {
            if (store.getters.roles.length === 0) {
                store.dispatch("GET_ADMIN_INFO").then((res) => {
                    let routerarr = handlerRouter([], res.data.routerList)
                    routerarr.forEach(element => router.addRoute("Layout", element))
                    next({ ...to, replace: true })
                }).catch((err) => {
                    console.error('Error fetching admin info:', err);
                    store.dispatch("Logout").then(() => {
                        Message.error(err)
                        next({ path: "/login" })
                    }).catch(err => {
                        REMOVE_SESSION_KEY("Token")
                        store.commit("SET_TOKEN", "")
                    })
                })
            } else {
                next()
            }
        }
    } else {
        if (whileList.indexOf(to.path) !== -1) {
            next()
        } else {
            next({ path: '/login' })
            nprogress.done()
        }
    }
})



router.afterEach(() => {
    nprogress.done();
})