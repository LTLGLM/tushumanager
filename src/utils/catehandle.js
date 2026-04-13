// 处理分类数据

export const catehandle = (data) => {
    let cateObj = {}
    data.forEach(element => {
        if (element.catePid == 0) {
            if (!cateObj[element.cateId]) {
                cateObj[element.cateId] = element
                cateObj[element.cateId].children = []
            }
        } else {
            cateObj[element.catePid].children.push(element)
        }
    });
    return Object.values(cateObj)
}