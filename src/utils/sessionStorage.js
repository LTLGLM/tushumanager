// 获取Session中的token
export const GET_SESSION_KEY = (key) => {
    return JSON.parse(window.sessionStorage.getItem(key))
}

// 设置Session中的token
export const SET_SEESION_KEY = (key, data) => {
    window.sessionStorage.setItem(key,JSON.stringify(data))
}

// 删除Session中的token
export const REMOVE_SESSION_KEY = (key) => {
    window.sessionStorage.removeItem(key)
}