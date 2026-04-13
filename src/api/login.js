import request from "@/utils/request"


// 获取验证码
export const getImgCode = () => {
    return request({
        url: "/common/kaptcha",
        method: "get",
        timeout: 20000
    })
}

// 登录接口
export const login = (userLoginInfo) => {
    return request({
        url: "/admin/login",
        method: "POST",
        data: userLoginInfo
    })
}

// 登出接口
export const logout = ()=>{
    return request({
        url:"/admin/logout",
        method: "post",
    })
}

// 获取用户信息
export const getAdminInfo = () => {
    return request({
        url: "/admin/info",
        method: 'get'
    })
}