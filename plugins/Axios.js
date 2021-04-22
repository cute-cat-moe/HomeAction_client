import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

export default function ({ $axios, redirect, store }) {
  $axios.onRequest((config) => {
    // 在请求之前做一些事情
    console.log('Making request to ' + config.url)
    // 设置显示进度条
    NProgress.start()

    // 添加 token 信息的请求
    if (config.url.includes('relative')) {
      // 当请求 url 包含 relative 时
      config.headers.Authorization = 'Bearer ' + store.state.relative.token
    } else if (config.url.includes('volunteer')) {
      // 当请求 url 包含 volunteer 时
      config.headers.Authorization = 'Bearer ' + store.state.volunteer.token
    }
  })
  $axios.onResponse((response) => {
    NProgress.done() // 进度条加载结束
    return Promise.resolve(response)
  })
  $axios.onResponseError((err) => {
    NProgress.done() // 进度条加载结束
    console.log(err)
    if (err && err.response) {
      switch (err.response.status) {
        case 400:
          err.message = '请求错误(400)'
          break
        case 401:
          // 回到登录界面
          if (store.state.role === false) {
            redirect('/')
          }
          err.message = 'token过期(401)'
          break
        case 403:
          err.message = '拒绝访问(403)'
          break
        case 404:
          err.message = '请求出错(404)'
          break
        case 408:
          err.message = '请求超时(408)'
          break
        case 500:
          err.message = '服务器错误(500)'
          break
        case 501:
          err.message = '服务未实现(501)'
          break
        case 502:
          err.message = '网络错误(502)'
          break
        case 503:
          err.message = '服务不可用(503)'
          break
        case 504:
          err.message = '网络超时(504)'
          break
        case 505:
          err.message = 'HTTP版本不受支持(505)'
          break
        default:
          err.message = `连接出错(${err.response.status})!`
      }
    } else {
      err.message = '连接服务器失败!'
    }
    return Promise.reject(err)
  })
}
