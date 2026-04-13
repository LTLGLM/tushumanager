import axios from "axios"
import { GET_SESSION_KEY, REMOVE_SESSION_KEY } from "@/utils/sessionStorage"
import errorCode from "@/utils/errorCode"
import { Message, MessageBox, Notification, Loading } from "element-ui"
// import router from '../router'
import store from '../store'

axios.defaults.headers["Content-Type"] = "application/json;charset=utf-8"

// Loading 实例
let loadingInstance;
// 当前正在请求的数量
let loadingCount = 0;

// 开启 Loading
function startLoading() {
    if (loadingCount === 0) {
        loadingInstance = Loading.service({
            lock: true,
            text: '加载中...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
        });
    }
    loadingCount++;
}

// 关闭 Loading
function endLoading() {
    loadingCount--;
    if (loadingCount <= 0) {
        loadingCount = 0;
        if (loadingInstance) {
            loadingInstance.close();
        }
    }
}

// 创建axios实例
const request = axios.create({
    // axios中请求配置URL公共部分
    baseURL: process.env.VUE_APP_BASE_API
})

// 请求拦截器
request.interceptors.request.use(config => {
    // 开启 loading
    startLoading();
    // 设置token
    if (GET_SESSION_KEY("Token")) {
        config.headers["Token"] = GET_SESSION_KEY("Token")// 让每个请求携带自定义token 请根据实际情况自行修改
    }
    // 必须要返回 不然请求发送不成功
    return config
}, error => {
    // 关闭 loading
    endLoading();
    Promise.reject(error)
})

let isTokenExpired = false; // 全局标志变量

// 响应拦截器
request.interceptors.response.use(res => {
    // 关闭 loading
    endLoading();
    // 获取状态码，默认是成功状态 200
    const code = res.data.code || 200;
    const msg = res.data.message || errorCode[code] || errorCode["default"];

    // 处理二进制数据
    if (res.request.responseType === 'blob' || res.request.responseType === 'arrayBuffer') {
        return res.data;
    }

    if (code === 200 && msg === "登录成功") {
        isTokenExpired = false
    }

    // 处理不同的状态码
    switch (code) {
        case 401:
            // 如果还没有弹出过登录过期提示框，才弹出
            if (!isTokenExpired) {
                isTokenExpired = true;  // 设置标志位
                handleTokenExpired();
            }
            break;
        case 500:
            showErrorMessage(msg);
            break;
        default:
            if (code !== 200) {
                showNotification(msg);
            } else {
                return res.data;
            }
            break;
    }
}, error => {
    // 关闭 loading
    endLoading();
    showErrorMessage("服务器端错误，请求发送未成功");
    return Promise.reject(error);
});

// 登录状态过期处理函数
function handleTokenExpired() {
    MessageBox.confirm("登录状态已过期，您可以继续留在该页面，或者重新登录", '系统提示', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        // 清除token
        REMOVE_SESSION_KEY("Token");
        // 断开ws连接
        store.state.websocket.websocketClient.disconnect()
        isTokenExpired = false
        // 刷新页面
        window.location.reload();

    }).catch(() => {
        // 如果用户点击了取消，可以在这里执行其他逻辑
        isTokenExpired = false
    });
}

// 错误提示信息
function showErrorMessage(msg) {
    Message({ message: msg, type: 'error' });
}

// 提示通知
function showNotification(msg) {
    Notification.error({ title: msg });
}

export default request;

