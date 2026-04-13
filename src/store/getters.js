const getters = {
    // 获取token
    token: state => state.user.token,
    // 获取userId
    userId: state => state.user.userId,
    // 获取username
    username: state => state.user.username,
    // 获取avatar
    avatar: state => state.user.avatar,
    // 获取roles
    roles: state => state.user.roles,
    // 获取btns
    btns: state => state.user.btns,
    // 获取sidebarRouters
    sidebarRouters: state => state.user.sidebarRouters,
    // 获取分类选择器
    selectcateList: state => state.cate.selectcateList,
    // 获取websocket连接对象
    websocketClient: state => state.websocket.websocketClient,
}

export default getters