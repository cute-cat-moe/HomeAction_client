<template>
  <!-- 首页的应用栏 -->
  <v-app-bar :color="barMode[mode].color" app dark dense fixed>
    <v-app-bar-nav-icon @click="getCurrentAddressDebounceFunc()"
      ><v-icon>mdi-map-marker-radius</v-icon></v-app-bar-nav-icon
    >
    <v-toolbar-title class="pl-1"
      >{{ currentLocation.city
      }}<span class="pl-2 body-1 opacity-primary">{{
        currentLocation.district
      }}</span></v-toolbar-title
    >
    <v-spacer />
    <v-btn v-if="barMode[mode].searchBtn === true" icon>
      <v-icon>mdi-magnify</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script>
export default {
  components: {},
  props: {
    mode: {
      type: Number,
      required: true,
    },
  },
  data: () => ({
    barMode: [
      {
        searchBtn: true,
        color: 'primary',
      },
      {
        // 老人家属-救援申请界面
        searchBtn: false,
        color: 'relativeColor',
      },
      {
        // 老人家属-新闻中心界面
        searchBtn: false,
        color: 'relativeColor',
      },
    ],
    currentLocation: {
      city: '定位中',
      district: '',
    },
    // 获取当前定位
    getCurrentAddressDebounceFunc: undefined,
  }),
  created() {
    // 获取当前的位置信息 currentLocation
    if (localStorage.currentLocation) {
      this.currentLocation = JSON.parse(localStorage.currentLocation)
    }
  },
  mounted() {
    // 立即获取当前定位，并
    // 绑定防抖函数，2 秒内不可连续触发
    this.getCurrentAddressDebounceFunc = this.$Main.debounce(
      this,
      this.getCurrentAddress,
      2000,
      true
    )
  },
  methods: {
    // 获取当前定位
    getCurrentAddress() {
      this.$Geolocation
        .getCurrentAddress()
        .then((res) => {
          console.log(res)
          if (res.status === 1) {
            const result = res.result
            const currentLocation = {
              city: result.addressResult.regeocode.addressComponent.city,
              district:
                result.addressResult.regeocode.addressComponent.district,
            }
            this.currentLocation = currentLocation
            localStorage.currentLocation = JSON.stringify(currentLocation)
            this.$Bus.$emit('openSnackbar', {
              text: '更新位置信息成功！',
            })
            // TODO: 上传当前定位信息到后台
          } else if (res.status === 2) {
            if (!localStorage.currentLocation) {
              this.currentLocation = {
                city: '定位失败',
                district: '',
              }
            }
            this.$Bus.$emit('openSnackbar', {
              text: '获取所在地区信息失败，请手动设置或稍后重试！',
            })
          } else {
            if (!localStorage.currentLocation) {
              this.currentLocation = {
                city: '定位失败',
                district: '',
              }
            }
            this.$Bus.$emit('openSnackbar', {
              text:
                '获取所在地区信息失败，发生未知错误，请手动设置或稍后尝试！',
            })
          }
        })
        .catch((error) => {
          console.log(error)
          if (!localStorage.currentLocation) {
            this.currentLocation = {
              city: '定位失败',
              district: '',
            }
          }
          this.$Bus.$emit('openSnackbar', {
            text: '定位失败，请确保允许应用获取定位信息或稍后重试！',
          })
        })
    },
  },
}
</script>
