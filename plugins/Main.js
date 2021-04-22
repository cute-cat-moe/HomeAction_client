// 全局可使用的函数
import Vue from 'vue'

/**
 * 触发事件后在 wait 毫秒内函数只执行一次；如果在 wait 毫秒内又触发了事件，则会重新计算函数执行时间
 * @param {Object} ctx 当前上下文，请传入 this
 * @param {Function} func 需要防抖的函数
 * @param {Number} wait 防抖的等待时间，单位为 ms
 * @param {Boolean} immediate 触发事件后立即执行函数
 * @returns 防抖执行的函数
 */
function debounce(ctx, func, wait, immediate = false) {
  let timeout
  return function () {
    const context = ctx
    const args = arguments

    if (timeout) clearTimeout(timeout)

    if (immediate) {
      const callNow = !timeout
      timeout = setTimeout(() => {
        timeout = null
      }, wait)
      if (callNow) func.apply(context, args)
    } else {
      timeout = setTimeout(function () {
        func.apply(context, args)
      }, wait)
    }
  }
}

/**
 * 连续触发事件但是在 wait 毫秒中只执行一次函数
 * @param {Object} ctx 当前上下文，请传入 this
 * @param {Function} func 需要节流的函数
 * @param {Number} wait 节流的等待时间，单位为 ms
 * @returns 节流执行的函数
 */
function throttle(ctx, func, wait) {
  let timeout
  return function () {
    const context = ctx
    const args = arguments
    if (!timeout) {
      timeout = setTimeout(() => {
        timeout = null
        func.apply(context, args)
      }, wait)
    }
  }
}

const Main = {
  install(Vue) {
    Vue.prototype.$Main = {
      debounce,
      throttle,
    }
  },
}

Vue.use(Main)
