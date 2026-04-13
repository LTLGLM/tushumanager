import logo from "./logo.vue";
import menu from "@/layout/menu/menu.vue";
import tabbar from "@/layout/tabbar/tabbar.vue";
import message from "./message/message.vue";
import ChainCard from "./card/chaincard.vue";
import IconCard from "./card/iconcard.vue";
import Echartscard from "./card/echartscard.vue";
import Editor from "./editor/editor.vue";
import Query from "./query/query.vue";
import svgIcon from "./svgIcon.vue";

const component = {
    "Logo": logo,
    "Menu": menu,
    "Tabbar": tabbar,
    "Message": message,
    "ChainCard": ChainCard,
    "IconCard": IconCard,
    "Echartscard": Echartscard,
    "Editor": Editor,
    "Query": Query,
    "svgIcon": svgIcon
}

const GlobalComponent = {
    install(Vue, opts = {}) {
        Object.keys(component).forEach(key => {
            Vue.component(key, component[key])
        })


    }
}

export default GlobalComponent