import request from "@/utils/request"

export const getLogList = (queryForm) => {
    return request({
        url: "/log/list",
        method: "GET",
        params: queryForm
    })
}


export const removeLogs = (ids) => {
    return request({
        url: "/log",
        method: "delete",
        data: ids
    })
}

export const removeLogAll = () => {
    return request({
        url: "/log/all",
        method: "delete"
    })
}