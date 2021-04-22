<template>
  <!-- 地图模板 -->
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
    },
    marker: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  data: () => ({
    // 地图对象
    aMap: {},
    // 地图定位插件
    geolocation: undefined,
    // 用户当前的经纬度
    currentPosition: undefined,
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
  },
  created() {
    this.aMap = this.map
  },
  mounted() {
    this.$nextTick(() => {
      this.initMap()
    })
  },
  methods: {
    // 初始化地图及覆盖物信息
    initMap() {
      // 销毁已存在的地图并初始化数据
      if (this.aMap.destroy !== undefined) {
        this.aMap.destroy()
      }
      this.aMap = {}
      this.geolocation = undefined
      this.currentPosition = undefined

      const that = this

      this.$nextTick(() => {
        // 初始化地图
        const map = new AMap.Map(this.$refs.mapContainer, {
          zoom: 11,
          mapStyle: 'amap://styles/whitesmoke',
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

        // 初始化地图覆盖物
        this.initMapMarker(map)

        // 根据地图覆盖物自动缩放地图
        this.setFitView(map)

        this.aMap = map
      })
    },
    // 获取当前定位信息
    // 设置 panToLocation 为 true 时，将地图中心移到当前位置
    // 设置 showResult 为 true 时，将显示定位成功时的结果
    getCurrentPosition({ panToLocation = false }) {
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
            this.$emit('setSnackbar', '获取当前定位信息成功！')
          }
        })
      }
    },
    // 初始化地图覆盖物
    initMapMarker(map) {
      if (map.clearMap !== undefined) {
        map.clearMap()

        for (const location of this.marker) {
          // 跳过不含 lnglat 项的地址
          if (location.lnglat && location.lnglat.length === 2) {
            const marker = new AMap.Marker({
              position: location.lnglat,
              offset: new AMap.Pixel(-18, -18),
              content: '<img src="/marker/map-marker-star.png" />',
            })
            map.add(marker)
          }
        }

        this.$emit('setSnackbar', '更新地图覆盖物成功！')
      }
    },
    // 使地图根据覆盖物情况自动缩放合适的视野级别
    setFitView(map) {
      if (map.setFitView !== undefined) {
        map.setFitView()
        this.$emit('setSnackbar', '自动缩放地图成功！')
      }
    },
    // 在地图中心显示模拟的标记点
    showCenterVirtualMarker(map) {
      // console.log(map.getCenter())
      if (map.remove !== undefined) {
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
      }
    },
  },
}
</script>

<style scoped></style>
