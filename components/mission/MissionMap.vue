<template>
  <!-- 任务地图，此组件依赖于 MissionMapDialog -->
  <div ref="mapContainer" />
</template>

<script>
/* eslint-disable no-undef */
export default {
  model: {
    prop: 'map',
    event: 'setMap',
  },
  props: {
    map: {
      type: Object,
      required: true,
      default: () => ({}),
    },
    mapDetail: {
      type: Object,
      required: true,
      default: () => ({}),
    },
    selectMarker: {
      type: Object,
      required: true,
      default: () => ({}),
    },
    addMarkerMode: {
      type: Boolean,
      required: true,
      default: false,
    },
    mapStyle: {
      type: String,
      required: true,
      default: 'amap://styles/whitesmoke',
    },
  },
  data: () => ({
    // 地图对象
    aMap: {},
    // 地图定位插件
    geolocation: undefined,
    // 用户当前的经纬度
    currentPosition: undefined,
    // 连续进行定位 timer
    geolocationTimer: undefined,
    // 当前选中的覆盖物
    currentSelectMarker: undefined,
    // 在地图中心模拟显示的覆盖物
    mapCenterVirtualMarker: undefined,
  }),
  watch: {
    map(newVal) {
      this.aMap = newVal
    },
    // aMap 更新时同步刷新父组件传入的 map
    aMap(newVal) {
      this.$emit('setMap', newVal)
    },
    // 当 mapDetail 对象发生改变时，刷新页面上的覆盖物
    mapDetail() {
      this.initMapMarker(this.aMap)
    },
    // 修改地图的主题
    mapStyle(newVal) {
      this.aMap.setMapStyle(newVal)
    },
    // 保存当前经纬度坐标
    currentPosition(newVal) {
      this.$emit('setCurrentPosition', newVal)
    },
    // 选中 Marker 时显示 Marker 详细信息
    currentSelectMarker(newVal) {
      this.$emit('setSelectMarker', newVal)
    },
    selectMarker(newVal) {
      this.currentSelectMarker = newVal
    },
    // 切换添加标记点模式
    addMarkerMode(newVal) {
      const map = this.aMap

      if (newVal) {
        // 切换到添加标记模式时
        // 为地图绑定平移事件，在中心显示模拟的标记点
        this.showCenterVirtualMarker()
        map.on('mapmove', this.showCenterVirtualMarker)
      } else {
        // 退出添加标记模式时
        // 为地图解绑平移事件，不在中心显示模拟的标记点
        map.off('mapmove', this.showCenterVirtualMarker)
        map.remove(this.mapCenterVirtualMarker)
        this.mapCenterVirtualMarker = undefined
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.initMap()

      // 提供重新初始化地图的方法
      this.$Bus.$on('reInitMissionMap', () => {
        this.initMap()
      })
    })
  },
  methods: {
    // 初始化地图定位及标签信息
    initMap() {
      // 清除已初始化的地图信息
      if (this.aMap.destroy !== undefined) {
        this.aMap.destroy()
      }
      this.aMap = {}
      this.geolocation = undefined
      this.currentPosition = undefined
      if (this.geolocationTimer) {
        window.clearInterval(this.geolocationTimer)
      }
      this.geolocationTimer = undefined
      this.currentSelectMarker = undefined
      // 清空订阅的事件
      this.$Bus.$off('getMissionMapCurrentPostion')
      this.$Bus.$off('setMissionMapFitView')
      this.$Bus.$off('reInitMissionMapMarker')

      this.$nextTick(() => {
        const that = this

        // 初始化地图，绑定给 mapContainer 元素
        const map = new AMap.Map(this.$refs.mapContainer, {
          zoom: 11,
          mapStyle: this.mapStyle,
          resizeEnable: true,
        })

        // 地图定位插件
        const geolocationOptions = {
          timeout: 2000,
          showButton: false,
          showMarker: true,
          markerOptions: {
            offset: new AMap.Pixel(-18, -18),
            content: '<img src="/marker/map-marker-radius.png" />',
          },
          showCircle: false,
          noIpLocate: 1,
          GeoLocationFirst: true,
          // 定位成功不自动回到定位位置
          panToLocation: false,
          useNative: true,
        }
        AMap.plugin(['AMap.Geolocation'], function () {
          const geolocation = new AMap.Geolocation(geolocationOptions)
          map.addControl(geolocation)
          that.geolocation = geolocation
          // 立即进行定位
          that.getCurrentPosition({
            panToLocation: false,
          })
        })

        // 每 3 秒执行一次定位并刷新当前位置信息
        this.geolocationTimer = setInterval(() => {
          this.getCurrentPosition({
            panToLocation: false,
          })
        }, 3000)

        // 提供立即获得当前定位的方法
        this.$Bus.$on('getMissionMapCurrentPostion', () => {
          this.getCurrentPosition({
            panToLocation: true,
            showResult: true,
          })
        })

        // 初始化地图覆盖物
        this.initMapMarker(map)

        // 提供重新初始化地图覆盖物的方法
        this.$Bus.$on('reInitMissionMapMarker', () => {
          this.initMapMarker(map)
        })

        // 根据地图覆盖物自动缩放地图
        this.setFitView(map)

        // 提供立即执行缩放地图的方法
        this.$Bus.$on('setMissionMapFitView', () => {
          this.setFitView(map, true)
        })

        this.aMap = map
      })
    },
    // 设置父组件显示 snackbar
    setSnackbar(msg) {
      this.$emit('setSnackbar', msg)
    },
    // 获取当前定位信息
    // 设置 panToLocation 为 true 时，将地图中心移到当前位置
    // 设置 showResult 为 true 时，将显示定位成功时的结果
    getCurrentPosition({ panToLocation = false, showResult = false }) {
      if (this.geolocation) {
        const that = this
        this.geolocation.getCurrentPosition((status, result) => {
          // console.log(status, result)
          if (status === 'complete') {
            // 定位成功时
            const lnglat = [result.position.lng, result.position.lat]
            that.currentPosition = lnglat
            if (panToLocation) {
              that.aMap.setCenter(lnglat)
            }
            if (showResult) {
              that.setSnackbar('获取当前定位成功！')
            }
          } else if (showResult) {
            // 定位失败，设置显示结果时
            that.setSnackbar('获取当前定位失败，请稍后重试')
          }
        })
      } else {
        // 绑定定位插件失败
        this.setSnackbar('获取当前定位信息异常，请尝试刷新页面')
      }
    },
    // 初始化地图覆盖物
    // 传入值为地图对象
    initMapMarker(map) {
      const that = this
      // 移除已有覆盖物
      map.clearMap()

      // 清除当前选择的覆盖物
      this.currentSelectMarker = undefined

      // 搜救区域设置
      const circleOptions = {
        strokeColor: '#2196F3',
        strokeOpacity: 0.3,
        fillColor: '#2196F3',
        fillOpacity: 0.2,
        strokeStyle: 'dashed',
      }

      if (this.mapDetail.lastKnownLocation) {
        // 处理老人走失地点
        const lastKnownLocation = this.mapDetail.lastKnownLocation
        const lastKnownLocationMaker = new AMap.Marker({
          position: lastKnownLocation.lnglat,
          offset: new AMap.Pixel(-18, -18),
          content: '<img src="/marker/home-map-marker.png" />',
          map,
        })
        lastKnownLocationMaker.markerCenter = lastKnownLocation.lnglat
        lastKnownLocationMaker.markerTitle =
          lastKnownLocation.name || '星标地点'
        lastKnownLocationMaker.markerSubtitle = '老人走失地点'
        lastKnownLocationMaker.markerContent = lastKnownLocation.content || ''
        lastKnownLocationMaker.markerTid = lastKnownLocation.tid || -1
        // 设置标记模式为 lastKnownLocation
        lastKnownLocationMaker.markerMode = 'lastKnownLocation'

        // 绑定点击事件
        lastKnownLocationMaker.on('click', () => {
          that.openInfoWindow(lastKnownLocationMaker)
        })

        // 当以走失地点创建搜救区域时
        if (lastKnownLocation.radius) {
          lastKnownLocationMaker.markerRadius = lastKnownLocation.radius
          const circle = new AMap.Circle({
            center: lastKnownLocation.lnglat,
            radius: lastKnownLocation.radius,
            ...circleOptions,
          })
          // 点击搜救区域仍打开 lastKnownLocationMaker 对应的信息窗口
          circle.on('click', () => {
            that.openInfoWindow(lastKnownLocationMaker)
          })
          // 修改 lastKnownLocationMaker 的副标题
          lastKnownLocationMaker.markerSubtitle += `，${
            lastKnownLocationMaker.markerTid !== -1
              ? `第 ${lastKnownLocation.tid} 小队`
              : ''
          }在该地点 ${lastKnownLocation.radius} 米范围内展开搜救`
          // 在地图上添加搜救区域
          map.add(circle)
        }
      }
      if (this.mapDetail.starLocation?.length !== 0) {
        // 处理老人常去地点
        for (const location of this.mapDetail.starLocation) {
          const starMarker = new AMap.Marker({
            position: location.lnglat,
            offset: new AMap.Pixel(-18, -18),
            content: '<img src="/marker/map-marker-star.png" />',
            map,
          })
          starMarker.markerCenter = location.lnglat
          starMarker.markerTitle = location.name || '星标地点'
          starMarker.markerSubtitle = '老人常去地点'
          starMarker.markerContent = location.content || ''
          starMarker.markerTid = location.tid || -1
          // 设置标记模式为 starLocation
          starMarker.markerMode = 'starLocation'

          starMarker.on('click', () => {
            that.openInfoWindow(starMarker)
          })

          if (location.radius) {
            starMarker.markerRadius = location.radius
            const circle = new AMap.Circle({
              center: location.lnglat,
              radius: location.radius,
              ...circleOptions,
            })
            circle.on('click', () => {
              that.openInfoWindow(starMarker)
            })
            starMarker.markerSubtitle += `，${
              starMarker.markerTid !== -1 ? `第 ${location.tid} 小队` : ''
            }在该地点 ${location.radius} 米范围内展开搜救`
            map.add(circle)
          }
        }
      }
      if (this.mapDetail.markLocation?.length !== 0) {
        // 处理指挥或队长标记地点
        for (const location of this.mapDetail.markLocation) {
          const marker = new AMap.Marker({
            position: location.lnglat,
            offset: new AMap.Pixel(-18, -18),
            content: '<img src="/marker/map-marker.png" />',
            map,
          })
          marker.markerTitle = location.name || '标记地点'
          marker.markerSubtitle = `${
            location.tid ? `第 ${location.tid} 小队` : ''
          }标记地点`
          marker.markerCenter = location.lnglat
          marker.markerContent = location.content || ''
          marker.markerTid = location.tid || -1
          // 设置标记模式为 markLocation
          marker.markerMode = 'markLocation'

          marker.on('click', () => {
            that.openInfoWindow(marker)
          })

          if (location.radius) {
            marker.markerRadius = location.radius
            const circle = new AMap.Circle({
              center: location.lnglat,
              radius: location.radius,
              ...circleOptions,
            })
            map.add(circle)
            circle.on('click', () => {
              that.openInfoWindow(marker)
            })
            marker.markerTitle = location.name || '搜救区域'
            marker.markerSubtitle = `${
              marker.markerTid !== -1 ? `第 ${location.tid} 小队` : ''
            }在该地点 ${location.radius} 米范围内展开搜救`
          }
        }
      }
    },
    // 点击覆盖物打开信息窗口
    openInfoWindow(marker) {
      // 不在添加标记点模式时，设置覆盖物坐标为当前地图中心
      if (!this.addMarkerMode) {
        this.aMap.setCenter(marker.markerCenter)
      }

      // 点击相同 marker 时返回
      if (marker === this.currentSelectMarker) {
        return
      }
      this.currentSelectMarker = marker
    },
    // 使地图根据覆盖物情况自动缩放合适的视野级别
    setFitView(map, showResult = false) {
      map.setFitView()
      if (showResult) {
        this.setSnackbar('已自动调整地图视野')
      }
    },
    // 移除任务 missionMapDetail 中的 markLocation 标记
    removeMissionMapDetailMarkLocation() {
      // 直接重新获取即可
      initMapMarker(this.aMap)
    },
    // 在地图中心显示模拟的标记点
    showCenterVirtualMarker() {
      const map = this.aMap
      // console.log(map.getCenter())
      if (this.mapCenterVirtualMarker) {
        map.remove(this.mapCenterVirtualMarker)
      }
      const virtualMarker = new AMap.Marker({
        position: map.getCenter(),
        offset: new AMap.Pixel(-18, -18),
        content: '<img src="/marker/map-marker-add.png" />',
        map,
      })
      this.mapCenterVirtualMarker = virtualMarker
    },
  },
}
</script>
