import request from "@/utils/request"

export const getMenuList = (queryForm) => {
    return request({
        url: "/menu/list",
        method: "get",
        params: queryForm
    })
}

export const getMenuTree = ()=>{
    return request({
        url: "/menu/tree",
        method: "get",
    })
}

export const getMenuById = (menuId) => {
    return request({
        url: `/menu/${menuId}`,
        method: "get",
    })
}

export const addMenu = (menu) => {
    return request({
        url: "/menu",
        method: "post",
        data: menu
    })
}

export const updateMenu = (menu) => {
    return request({
        url: "/menu",
        method: "put",
        data: menu
    })
}

export const removeMenuIds = (menuIds) => {
    return request({
        url: `/menu`,
        method: "delete",
        data: menuIds
    })
}