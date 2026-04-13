import request from "@/utils/request"

export const getVipUserList = (queryForm) => {
    return request({
        url: "/storeUser/list",
        method: "get",
        params: queryForm
    })
}

export const getVipUserById = (vipUserId) => {
    return request({
        url: `/storeUser/${vipUserId}`,
        method: "get",
    })
}

export const addVipUser = (data) => {
    return request({
        url: "/storeUser",
        method: "post",
        data
    })
}

export const updateVipUser = (data) => {
    return request({
        url: "/storeUser",
        method: "put",
        data
    })
}

export const deleteVipUser = (vipUserId) => {
    return request({
        url: `/storeUser/${vipUserId}`,
        method: "delete",
    })
}

export const deleteVipUsers = (ids) => {
    return request({
        url: "/storeUser",
        method: "delete",
        data: ids
    })
}