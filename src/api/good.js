import request from "@/utils/request"

export const getGoodList = (queryForm) => {
    return request({
        url: "/storeGood/list",
        method: "get",
        params: queryForm
    })
}

export const getGoodById = (goodId) => {
    return request({
        url: `/storeGood/${goodId}`,
        method: "get"
    })
}

export const addGood = (good) => {
    return request({
        url: "/storeGood",
        method: "post",
        data: good
    })
}

export const updateGood = (good)=>{
    return request({
        url: "/storeGood",
        method: "put",
        data: good
    })
}

export const removeGood = (goodId)=>{
    return request({
        url: `/storeGood/${goodId}`,
        method: "delete",
    })
}


export const removeGoods = (goodIds)=>{
    return request({
        url: "/storeGood",
        method: "delete",
        data: goodIds
    })
}

export const updateGoodStatus = (good)=>{
    return request({
        url: "/storeGood/isShow",
        method: "put",
        data: good
    })
}