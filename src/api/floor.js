import request from "@/utils/request"

export const getFloorAll = () => {
    return request({
        url: "/storeFloor/all",
        method: "get"
    })
}

export const getFloorList = (queryForm) => {
    return request({
        url: "/storeFloor/list",
        method: "get",
        params: queryForm
    })
}

export const getFloorById = (floorId) => {
    return request({
        url: `/storeFloor/${floorId}`,
        method: "get"
    })
}

export const addFloor = (floor) => {
    return request({
        url: "/storeFloor",
        method: "post",
        data: floor
    })
}

export const updateFloor = (floor) => {
    return request({
        url: "/storeFloor",
        method: "put",
        data: floor
    })
}

export const removeFloorById = (floorId) => {
    return request({
        url: `/storeFloor/${floorId}`,
        method: "delete",
    })
}

export const removeFloorByIds = (floorIds) => {
    return request({
        url: "/storeFloor",
        method: "delete",
        data: floorIds
    })
}