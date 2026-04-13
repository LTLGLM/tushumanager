import request from "@/utils/request"

export const getAddresList = (queryForm) => {
    return request({
        url: "/storeAddress/list",
        method: "get",
        params: queryForm
    })
}

export const getAddressById = (addressId) => {
    return request({
        url: `/storeAddress/${addressId}`,
        method: "get"
    })
}

export const updateAddress = (address) => {
    return request({
        url: "/storeAddress",
        method: "put",
        data: address
    })
}

export const removeAddress = (addressId) => {
    return request({
        url: `/storeAddress/${addressId}`,
        method: "delete"
    })
}

export const removeAddressByIds = (addressIds) => {
    return request({
        url: "/storeAddress",
        method: "delete",
        data: addressIds
    })
}

export const setDefaultAddress = (address) => {
    return request({
        url: `/storeAddress/default`,
        method: "put",
        data: address
    })
}

