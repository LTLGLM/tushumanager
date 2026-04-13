import { GET_SESSION_KEY } from "./sessionStorage";

class WebSocketService {
    constructor(namespace) {
        this.namespace = namespace || ""; // 命名空间
        this.socket = null; // WebSocket 实例
        this.pingInterval = 30000; // 心跳间隔
        this.reconnectInterval = 5000; // 重连间隔
        // this.maxReconnectAttempts = 10; // 最大重连次数
        this.reconnectAttempts = 0; // 当前重连次数
        this.pingTimer = null; // 心跳定时器
        this.eventCallbacks = {}; // 存储事件回调
    }

    connect() {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) return;

        const token = GET_SESSION_KEY("Token");
        const url = this.namespace ? `ws://localhost:8088/${this.namespace}` : `ws://localhost:8088`;
        const fullUrl = token ? `${url}?token=${token}` : url;

        this.socket = new WebSocket(fullUrl);

        this.socket.onopen = () => {
            console.log("WebSocket 已连接");
            this.reconnectAttempts = 0; // 重置重连次数
            this.startHeartbeat(); // 开启心跳
        };

        this.socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type && this.eventCallbacks[data.type]) {
                    this.eventCallbacks[data.type].forEach(callback => callback(data));
                } else {
                    console.warn("未匹配到的 WebSocket 事件类型：", data);
                }
            } catch (error) {
                console.error("WebSocket 消息解析失败:", error);
            }
        };


        this.socket.onclose = () => {
            console.log("WebSocket 断开");
            this.stopHeartbeat();
            this.reconnect();
        };

        this.socket.onerror = (error) => {
            console.error("WebSocket 错误:", error);
        };
    }

    sendMessage(event, message) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({ event, message }));
        } else {
            console.error("WebSocket 未连接，消息发送失败");
        }
    }

    on(event, callback) {
        if (!this.eventCallbacks[event]) {
            this.eventCallbacks[event] = [];
        }
        this.eventCallbacks[event].push(callback);
    }

    disconnect() {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
            this.stopHeartbeat();
            console.log("WebSocket 已断开");
        }
    }

    startHeartbeat() {
        this.pingTimer = setInterval(() => {
            if (this.socket && this.socket.readyState === WebSocket.OPEN) {
                this.socket.send(JSON.stringify({ event: "ping" }));
            }
        }, this.pingInterval);
    }

    stopHeartbeat() {
        if (this.pingTimer) {
            clearInterval(this.pingTimer);
            this.pingTimer = null;
        }
    }

    reconnect() {
        this.reconnectAttempts++;
        console.log(`尝试重连 WebSocket (${this.reconnectAttempts}次)`);
        setTimeout(() => this.connect(), this.reconnectInterval);
    }
}

export default WebSocketService;
