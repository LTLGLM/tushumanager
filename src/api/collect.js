import request from "@/utils/request"

export const getCollectList = (queryForm)=>{
    return request({
        url: '/storeUserCollect/list',
        method: 'get',
        params: queryForm
    })
}

export const getCollectById = (collectId)=>{
    return request({
        url: '/storeUserCollect/' + collectId,
        method: 'get'
    })
}

export const removeCollectById = (collectId)=>{
    return request({
        url: '/storeUserCollect/' + collectId,
        method: 'delete'
    })
}

export const removeCollectByIds = (collectIds)=>{
    return request({
        url: '/storeUserCollect',
        method: 'delete',
        data: collectIds
    })
}