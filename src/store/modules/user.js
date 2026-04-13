import { login, getAdminInfo, logout } from "@/api/login"
import { GET_SESSION_KEY, REMOVE_SESSION_KEY, SET_SEESION_KEY } from "@/utils/sessionStorage";

const user = {
    state: {
        token: GET_SESSION_KEY('token') || "",
        userId: "",
        username: "",
        avatar: "",
        roles: [],
        btns: [],
        sidebarRouters: [],
        handlerRouters: []
    },
    mutations: {
        SET_TOKEN: (state, token) => {
            state.token = token
        },
        SET_USERID: (state, userId) => {
            state.userId = userId
        },
        SET_USERNAME: (state, username) => {
            state.username = username
        },
        SET_AVATAR: (state, avatar) => {
            state.avatar = avatar
        },
        SET_ROLES: (state, roles) => {
            state.roles = roles
        },
        SET_BTNS: (state, btns) => {
            state.btns = btns
        },
        SET_SIDEBAR_ROUTERS: (state, sidebarRouters) => {
            state.sidebarRouters = sidebarRouters
        },
        SET_HANDLER_ROUTERS: (state, handlerRouters) => {
            state.handlerRouters = handlerRouters
        }
    },

    actions: {
        // 用户登录
        Login(state, userLoginInfo) {
            return new Promise((resolve, reject) => {
                login(userLoginInfo).then((res) => {
                    // 将Token存入session
                    SET_SEESION_KEY("Token", res.data.token);
                    // 将Token存入store
                    state.commit("SET_TOKEN", res.data.token)
                    resolve(res)
                }).catch(error => reject(error));
            })
        },

        // 用户登出
        Logout(state,getters,rootState) {
            return new Promise((resolve, reject) => {
                logout().then(res => {
                    // 删除Token
                    REMOVE_SESSION_KEY("Token")
                    // 清空 Vuex 中的用户信息
                    state.commit("SET_TOKEN", "")
                    state.commit("SET_USERID", "")
                    state.commit("SET_USERNAME", "")
                    state.commit("SET_AVATAR", "")
                    state.commit("SET_ROLES", [])
                    state.commit("SET_BTNS", [])
                    state.commit("SET_SIDEBAR_ROUTERS", [])
                    state.commit("SET_HANDLER_ROUTERS", [])
                    resolve(res)
                }).catch(error => reject(error))
            })
        },

        // 获取用户的信息
        GET_ADMIN_INFO(state) {
            return new Promise((resolve, reject) => {
                getAdminInfo().then((res) => {
                    if (!res) return reject("验证失败，请重新登录")
                    state.commit("SET_USERID", res.data.adminId)
                    state.commit("SET_USERNAME", res.data.username)
                    state.commit("SET_AVATAR", res.data.avatar)
                    state.commit("SET_ROLES", res.data.roleList)
                    state.commit("SET_BTNS", res.data.btnList)
                    state.commit("SET_SIDEBAR_ROUTERS", res.data.routerList)
                    resolve(res)
                }).catch(error => reject(error))
            });
        },


    },
}

export default user;