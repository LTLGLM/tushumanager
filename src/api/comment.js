import request from '@/utils/request'

// 获取评论列表
export function getCommentList(params) {
  return request({
    url: '/admin/comment/list',
    method: 'get',
    params
  })
}

// 删除/隐藏评论
export function removeComment(ids) {
  return request({
    url: '/admin/comment/remove',
    method: 'post',
    data: { ids }
  })
}

// 屏蔽回复
export function removeReply(commentId) {
  return request({
    url: '/admin/comment/removeReply',
    method: 'post',
    data: { commentId }
  })
}
