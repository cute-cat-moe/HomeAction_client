<template>
  <!-- 地图选地址对话框 -->
  <div>
    <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      persistent
      no-click-animation
      transition="dialog-bottom-transition"
    >
      <v-card>
        <!-- 菜单栏 -->
        <v-toolbar :dark="themeDark" :color="themeColor" class="map-toolbar">
          <v-btn icon :dark="themeDark" @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>

          <!-- 设置地图缩放自适应 -->
          <v-toolbar-title class="px-2 mr-12" @click="setFitView">{{
            mutiple ? '选择多个地点' : '选择一个地点'
          }}</v-toolbar-title>

          <v-toolbar-items>
            <!-- 设置地图中心点为当前定位 -->
            <v-btn icon @click="getCurrentPosition">
              <v-icon>mdi-crosshairs-gps</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>

        <!-- 地图 -->
        <Map
          ref="map"
          v-model="map"
          class="map"
          :marker="select"
          @setSnackbar="setSnackbar"
        />

        <!-- 底部通知 -->
        <Snackbar
          v-model="snackbar"
          class="map-snackbar"
          :text="snackbarText"
          :timeout="3000"
          :color="themeColor"
          :dark="themeDark"
        />
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Map from '~/components/modal/MapSelectAddress'
import Snackbar from '~/components/modal/BottomSnackbar'

export default {
  components: { Map, Snackbar },
  model: {
    prop: 'mapSelectAddressDialog',
    event: 'onOpenCloseMapSelectAddressDialog',
  },
  props: {
    // 显示对话框
    mapSelectAddressDialog: {
      type: Boolean,
      required: true,
      default: false,
    },
    // 允许多选
    mutiple: {
      type: Boolean,
      required: false,
      default: false,
    },
    // 选择的地址对象
    // mutiple 为 false 时传入这个
    selectAddress: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    // 选择的地址数组
    // mutiple 为 true 时传入这个
    selectAddressArray: {
      type: Array,
      required: false,
      default: () => [],
    },
    themeColor: {
      type: String,
      required: false,
      default: 'primary',
    },
    themeDark: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  data: () => ({
    map: {},
    dialog: false,
    select: [],
    // 底部通知
    snackbar: false,
    snackbarText: '',
    // 地图已加载
    mapLoaded: false,
  }),
  watch: {
    // 打开对话框时设置覆盖物
    mapSelectAddressDialog(newVal) {
      this.dialog = newVal

      let select = []
      if (this.mutiple) {
        select = this.selectAddressArray
      } else {
        select.push(this.selectAddress)
      }

      this.select = select

      if (this.mapLoaded) {
        this.$refs.map.initMapMarker(this.map)
      }
    },
    dialog(newVal) {
      this.$emit('onOpenCloseMapSelectAddressDialog', newVal)
    },
    map(newVal) {
      console.log(newVal)
      this.mapLoaded = true
    },
  },
  created() {
    this.dialog = this.mapSelectAddressDialog
  },
  methods: {
    // 打开底部的通知
    setSnackbar(msg) {
      if (msg) {
        this.snackbar = false
        this.$nextTick(() => {
          this.snackbarText = msg
          this.snackbar = true
        })
      }
    },
    // 自适应地图的视野范围
    setFitView() {
      this.$refs.map.setFitView(this.map)
    },
    // 地图定位到当前用户位置
    getCurrentPosition() {
      this.$refs.map.getCurrentPosition({
        panToLocation: true,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.map {
  height: 100vh;
  width: 100vw;
  z-index: 998;
}

.map-toolbar {
  position: fixed;
  z-index: 999;
  margin-top: 16px;
}

.map-fab {
  z-index: 999;
}

.map-snackbar {
  z-index: 999;
}
</style>
