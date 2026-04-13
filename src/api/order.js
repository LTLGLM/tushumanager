import request from '@/utils/request'

// 获取订单列表
export function getOrderList() {
  return request({
    url: '/store-order/list',
    method: 'get'
  })
}

// 获取单个订单详情
export function getOrderDetail(orderId) {
  return request({
    url: `/store-order/${orderId}`,
    method: 'get'
  })
}

// 获取订单总体统计信息
export function getOrderOverview() {
  return request({
    url: '/store-order-stat/overview',
    method: 'get'
  })
}

// 获取时间维度统计
export function getTimeAnalysis(days) {
  return request({
    url: `/store-order-stat/time-analysis/${days}`,
    method: 'get'
  })
} 