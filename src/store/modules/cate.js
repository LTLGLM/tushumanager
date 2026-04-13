import { getCateList } from "@/api/cate";
import { catehandle } from "@/utils/catehandle";

const cate = {
    state: {
        selectcateList: [],
    },
    mutations: {
        SET_SELECTCATE_LIST(state, cartList) {
            state.selectcateList = cartList;
        },
    },
    actions: {
        getCates(state) {
            return new Promise((resolve, reject) => {
                getCateList().then((res) => {
                    let selectcateList = catehandle(res.data)
                    state.commit('SET_SELECTCATE_LIST', selectcateList)
                    resolve(res.data)
                }).catch((err) => {
                    reject(new Error(err))
                })
            })
        },
    }
}

export default cate