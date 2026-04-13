import request from '@/utils/request'

// 获取用户基础统计信息
export function getUserBasicStats() {
  return request({
    url: '/store-user-stat/basic',
    method: 'get'
  })
}

// 获取用户年龄分布
export function getUserAgeStats() {
  return request({
    url: '/store-user-stat/age',
    method: 'get'
  })
}

// 获取用户注册趋势
export function getUserRegistrationTrend() {
  return request({
    url: '/store-user-stat/registration',
    method: 'get'
  })
}

// 获取用户画像分析
export function getUserPortrait() {
  return request({
    url: '/store-user-stat/portrait',
    method: 'get'
  })
} 