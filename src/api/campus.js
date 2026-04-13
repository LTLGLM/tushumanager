import request from "@/utils/request"

// 获取校区列表
export function getCampusList() {
    return request({
        url: '/store-campus/list',
        method: 'get'
    })
}

// 获取校区详情
export function getCampusById(id) {
    return request({
        url: `/store-campus/${id}`,
        method: 'get'
    })
}

// 新增校区
export function addCampus(data) {
    return request({
        url: '/store-campus',
        method: 'post',
        data: data
    })
}

// 修改校区
export function updateCampus(data) {
    return request({
        url: '/store-campus',
        method: 'put',
        data: data
    })
}

// 删除校区
export function removeCampusById(id) {
    return request({
        url: `/store-campus/${id}`,
        method: 'delete'
    })
}

// 批量删除校区
export function removeCampusByIds(ids) {
    return request({
        url: '/store-campus/batch',
        method: 'delete',
        data: ids
    })
}