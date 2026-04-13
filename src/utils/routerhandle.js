export const handlerRouter = (routerarr, routerList) => {
    routerList.forEach(element => {
        // 确保 `element.component` 是一个有效的路径字符串
        if (element.component && typeof element.component === 'string') {
            try {
                // 动态导入组件
                element.component = loadView(element.component);
                routerarr.push(element)
            } catch (error) {
                console.error(`Failed to load component at ${element.component}`, error);
            }
        }

        // 如果有子路由，递归处理
        if (element.children && element.children.length > 0) {
            handlerRouter(routerarr, element.children);
        }
    });
    return routerarr;
};

export const loadView = (componentPath) => {
    return () => import(`@/views${componentPath}.vue`);
}