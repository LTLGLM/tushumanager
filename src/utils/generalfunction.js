// 防抖
const Debounce = (func, delay) => {
    let timer = null;
    return function (...args) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, args)
        }, delay)
    }
}

// 节流
const Throttle = (func, delay) => {
    let startTime = new Date().getTime()
    return function (...args) {
        let endTime = new Date().getTime()
        if (endTime - startTime >= delay) {
            func.apply(this, args)
            startTime = endTime
        }
    }
}

export {
    Debounce,
    Throttle
}