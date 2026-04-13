import request from "@/utils/request"

// 查询可选角色
export const getSelectRoles = () => {
    return request({
        url: "/role/selectAll",
        method: "get"
    })
}
// 查询所有角色
export const getRoleList = (queryForm) => {
    return request({
        url: "/role/list",
        method: "get",
        params: queryForm
    })
}
// 获取单个角色信息
export const getRoleById = (roleId) => {
    return request({
        url: `/role/${roleId}`,
        method: "get"
    })
}
// 新增角色
export const addRole = (role) => {
    return request({
        url: `/role`,
        method: "post",
        data: role
    })
}

// 修改角色
export const updateRole = (role) => {
    return request({
        url: `/role`,
        method: "put",
        data: role
    })
}

// 删除角色
export const removeRole = (roleId) => {
    return request({
        url: `/role/${roleId}`,
        method: "delete",
    })
}

// 批量删除角色
export const removeRoleIds = (ids) => {
    return request({
        url: "/role",
        method: "delete",
        data: ids
    })
}

// 获取角色权限
export const getRoleMenus = (roleId) => {
    return request({
        url: `/roleMenu/${roleId}`,
        method: "get"
    })
}

// 更新角色权限
export const updateRoleMenu = (roleId, menuIds) => {
    return request({
        url: `/roleMenu/${roleId}`,
        method: "put",
        data: menuIds
    })
}
