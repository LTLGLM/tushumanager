import request from "@/utils/request"

export const getCateList = (queryForm)=>{
    return request({
        url: '/storeCate/list',
        method: 'get',
        params: queryForm
    })
}

export const getCateById = (categoryId)=>{
    return request({
        url: `/storeCate/${categoryId}`,
        method: 'get'
    })
}

export const addCate = (cate)=>{
    return request({
        url: `/storeCate`,
        method: 'post',
        data: cate
    })
}

export const updateCate = (cate)=>{
    return request({
        url: `/storeCate`,
        method: 'put',
        data: cate
    })
}

export const removeCates = (categoryId)=>{
    return request({
        url: `/storeCate`,
        method: 'delete',
        data: categoryId
    })
}