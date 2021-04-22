// 文档：https://dayjs.gitee.io/zh-CN/
import Vue from 'vue'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import relativeTime from 'dayjs/plugin/relativeTime'
// import utc from 'dayjs/plugin/utc'
// import timezone from 'dayjs/plugin/timezone'

dayjs.locale('zh-cn')
dayjs.extend(relativeTime)
// dayjs.extend(utc)
// dayjs.extend(timezone)

/**
 * 返回当前的时间
 * 返回值为 dayjs 对象
 */
function getCurrentTime() {
  return dayjs()
}

/**
 * 返回当前的时间戳
 * 返回值为 number
 */
function getCurrentUnixTime() {
  return dayjs().valueOf()
}

/**
 * 返回现在到当前实例的相对时间
 * 参数为 UNIX 时间戳
 */
function getTimeFronNow(unixTime) {
  return dayjs(unixTime).fromNow(true)
}

/**
 * 返回当前实例到现在的相对时间
 * 参数为 UNIX 时间戳
 */
function getTimeToNow(unixTime) {
  return dayjs(unixTime).toNow(true)
}

/**
 * 获得当前实例的 UNIX 时间戳，精确到毫秒
 * 参数为 dayjs 实例
 */
function getUnixTime(dayjsTime) {
  return dayjsTime.valueOf()
}

/**
 * 格式化时间
 * dateTime 是时间
 * formatPattern 参考 https://dayjs.fenxianglu.cn/category/display.html#%E6%A0%BC%E5%BC%8F%E5%8C%96
 */
function formatDateTime(dateTime, formatPattern) {
  return dayjs(dateTime).format(formatPattern)
}

const Dayjs = {
  install(Vue) {
    Vue.prototype.$Dayjs = {
      getCurrentTime,
      getCurrentUnixTime,
      getTimeFronNow,
      getTimeToNow,
      getUnixTime,
      formatDateTime,
    }
  },
}

Vue.use(Dayjs)
