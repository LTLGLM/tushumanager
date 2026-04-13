import request from "@/utils/request"

export const getNoticeList = (queryForm) => {
    return request({
        url: "/notice/list",
        method: "get",
        params: queryForm
    })
}

export const getNoticeById = (noticeId) => {
    return request({
        url: `/notice/${noticeId}`,
        method: "get",
    })
}


export const addNotice = (notice) => {
    return request({
        url: "/notice",
        method: "post",
        data: notice
    })
}

export const updateNotice = (notice) => {
    return request({
        url: "/notice",
        method: "put",
        data: notice
    })
}

export const removeNotice = (noticeId) => {
    return request({
        url: `/notice/${noticeId}`,
        method: "delete",
    })
}

export const removeNoticeIds = (ids) => {
    return request({
        url: "/notice",
        method: "delete",
        data: ids
    })
}

// 获取个人的全部通知
export const getNoticeByAdmin = (adminId) => {
    return request({
        url: `/notice/admin/${adminId}`,
        method: "get",
    })
}

// 更新用户是否已读通知状态
export const updateAdminNoticeStatus = (notice) => {
    return request({
        url: `/adminNotice/status`,
        method: "put",
        data: notice
    })
}

// 全部已读
export const updateAllNoticeStatus = ()=>{
    return request({
        url: "/adminNotice/allStatus",
        method: "put"
    })
}