import request from "@/utils/request"

// 获取用户列表，包括查询
export const getAdminList = (queryForm) => {
    return request({
        url: "/adminUser/list",
        method: "get",
        params: queryForm
    })
}

// 根据ID获取用户
export const getAdminById = (id) => {
    return request({
        url: `/adminUser/${id}`,
        method: "get",
    })
}

// 新增用户接口
export const addAdminUser = (data) => {
    return request({
        url: "/adminUser",
        method: "post",
        data
    })
}

// 更新用户接口
export const updateAdminUser = (data) => {
    return request({
        url: "/adminUser",
        method: "put",
        data
    })
}


// 删除用户接口
export const removeAdminUser = (id) => {
    return request({
        url: `/adminUser/${id}`,
        method: "delete",
    })
}

// 批量删除用户接口
export const removeAdminUserIds = (ids) => {
    return request({
        url: `/adminUser`,
        method: "delete",
        data: ids
    })
}

// 根据关键词查询用户
export const getAdminByAdmin = (query)=>{
    return request({
        url: "/adminUser/admin",
        method: "get",
        params: query
    })
}


