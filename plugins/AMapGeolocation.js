import Vue from 'vue'

// eslint-disable-next-line no-undef
const geolocation = new AMap.Geolocation({
  timeout: 10000, // 超过 10 秒后停止定位
  noIpLocate: 1, // 禁止移动端使用 IP 定位
  useNative: true, // 使用安卓定位 sdk 用来进行定位
})

/**
 * 获取当前的经纬度坐标
 * https://developer.amap.com/api/javascript-api/reference/location
 */
function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    geolocation.getCurrentPosition((status, positionResult) => {
      if (status === 'complete') {
        resolve({
          status: 1,
          msg: '获取地理位置成功',
          result: positionResult,
        })
      } else {
        // 定位失败
        reject(new Error(`获取地理位置失败：${positionResult.message}`))
      }
    })
  })
}

/**
 * 获取当前地理坐标的逆编码结果
 * https://developer.amap.com/api/javascript-api/reference/lnglat-to-address
 */
function getCurrentAddress() {
  return new Promise((resolve, reject) => {
    getCurrentPosition()
      .then((positionResult) => {
        const lnglat = [
          positionResult.result.position.lng,
          positionResult.result.position.lat,
        ]
        // eslint-disable-next-line no-undef
        const geocoder = new AMap.Geocoder()
        geocoder.getAddress(lnglat, (addressStatus, addressResult) => {
          if (addressStatus === 'complete' && addressResult.regeocode) {
            resolve({
              status: 1,
              msg: '获取地理位置和地区信息成功',
              result: { positionResult: positionResult.result, addressResult },
            })
          } else {
            resolve({
              status: 2,
              msg: '获取地理位置成功，但获取地区信息失败',
              result: { positionResult: positionResult.result },
            })
          }
        })
      })
      .catch((err) => {
        reject(err)
      })
  })
}

const AMapGeolocation = {
  install(Vue) {
    Vue.prototype.$Geolocation = {
      getCurrentPosition,
      getCurrentAddress,
    }
  },
}

Vue.use(AMapGeolocation)
