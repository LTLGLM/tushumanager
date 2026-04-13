import request from "@/utils/request"

export const getFootmarkList = (queryForm) => {
    return request({
        url: '/storeUserFootmark/list',
        method: 'get',
        params: queryForm
    })
}

export const getFootmarkById = (footmarkId) => {
    return request({
        url: '/storeUserFootmark/' + footmarkId,
        method: 'get'
    })
}

export const removeFootmarkById = (footmarkId) => {
    return request({
        url: '/storeUserFootmark/' + footmarkId,
        method: 'delete'
    })
}

export const removeFootmarkByIds = (footmarkIds) => {
    return request({
        url: '/storeUserFootmark',
        method: 'delete',
        data: footmarkIds
    })
}