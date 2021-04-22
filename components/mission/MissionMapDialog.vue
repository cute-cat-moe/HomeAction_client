<template>
  <!-- 任务地图页面 -->
  <v-dialog
    v-model="dialog"
    fullscreen
    hide-overlay
    persistent
    no-click-animation
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-toolbar :dark="themeDark" :color="themeColor" class="map-toolbar">
        <v-btn icon :dark="themeDark" @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>

        <v-toolbar-title class="px-2 mr-12" @click="setFitView()"
          >任务地图</v-toolbar-title
        >

        <v-toolbar-items>
          <!-- 定位按钮 -->
          <v-btn icon @click="getCurrentPosition()">
            <v-icon>mdi-crosshairs-gps</v-icon>
          </v-btn>

          <v-menu v-model="menu" bottom right tile>
            <template #activator="{ on, attrs }">
              <v-btn :dark="themeDark" icon v-bind="attrs" v-on="on">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>

            <v-list>
              <v-list-item color="primaryMission">
                <v-list-item-title>关闭菜单</v-list-item-title>
              </v-list-item>
              <v-list-item @click="reInitMissionMap()">
                <v-list-item-title>刷新地图</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar-items>
      </v-toolbar>

      <!-- 信息窗口 -->
      <!-- 选中 marker -->
      <v-fade-transition>
        <v-card
          v-if="selectMarker && selectMarker.markerCenter !== undefined"
          class="map-info-window"
        >
          <v-card-title style="display: inline-block"
            >{{ selectMarker.markerTitle || '标记地点'
            }}<v-btn
              icon
              color="primaryMission"
              class="ml-2"
              @click="
                getNavigation(
                  currentPosition,
                  selectMarker.markerCenter,
                  selectMarker.markerTitle
                )
              "
              ><v-icon>mdi-map-search</v-icon></v-btn
            ></v-card-title
          >
          <v-card-subtitle>{{ selectMarker.markerSubtitle }}</v-card-subtitle>
          <v-card-text v-if="selectMarker.markerContent">{{
            selectMarker.markerContent
          }}</v-card-text>
          <v-divider class="pt-2 pb-0 mx-2" />
          <v-card-actions class="pt-0">
            <v-btn
              v-if="role === 'leader' && selectMarker.markerMode"
              text
              color="primaryMission"
              @click="editMarkerDialog = true"
              ><v-icon left>mdi-pencil-outline</v-icon>编辑</v-btn
            >
            <!-- 只有志愿者添加的标记可以被移除 -->
            <v-btn
              v-if="
                role === 'leader' && selectMarker.markerMode === 'markLocation'
              "
              text
              class="ml-2 opacity-secondary"
              @click="removeMarkerDialog = true"
              ><v-icon left>mdi-map-marker-remove</v-icon>移除</v-btn
            >
            <v-spacer />
            <v-btn
              text
              class="ml-2 opacity-secondary"
              @click="selectMarker = {}"
              >关闭</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-fade-transition>

      <!-- 编辑标记对话框 -->
      <ConfirmDialog
        v-if="selectMarker && selectMarker.markerMode"
        v-model="editMarkerDialog"
        title="编辑标记"
        :custom="true"
        :custom-confirm-button="true"
        :loading="modifyMarkerLoading"
        color="primaryMission"
      >
        <div class="pb-6">
          您正在编辑标记<span class="font-weight-bold">{{
            selectMarker.markerTitle
          }}</span
          >{{
            selectMarker.markerSubtitle
              ? `(${selectMarker.markerSubtitle})`
              : ''
          }}
        </div>
        <v-form ref="editMarkerDialogForm">
          <v-row no-gutters>
            <v-col cols="12">
              <v-select
                v-model="editMarkerDialogSelectTeam"
                class="mr-1"
                :items="teamItems"
                item-text="item"
                item-value="tid"
                color="primaryMission"
                item-color="primaryMission"
                filled
                label="绑定小队"
              ></v-select>
            </v-col>
            <v-col cols="6">
              <v-select
                v-model="editMarkerDialogSelectType"
                class="mr-1"
                :items="markerType"
                color="primaryMission"
                item-color="primaryMission"
                filled
                label="标记类别"
              ></v-select>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="editMarkerDialogInputRadius"
                class="ml-1"
                :disabled="editMarkerDialogSelectType === '标记点'"
                color="primaryMission"
                label="救援区域半径（米）"
                :rules="
                  editMarkerDialogSelectType === '标记点'
                    ? []
                    : [rules.markerRadius]
                "
                filled
                type="Number"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="editMarkerDialogInputContent"
                label="标记备注信息"
                color="primaryMission"
                filled
                rows="2"
                auto-grow
              ></v-textarea>
            </v-col>
          </v-row>
        </v-form>
        <template #confirmButton>
          <v-btn
            class="white--text"
            depressed
            color="primaryMission"
            :disabled="modifyMarkerLoading"
            :loading="modifyMarkerLoading"
            @click="
              editMarkerInfo(
                selectMarker,
                editMarkerDialogSelectTeam,
                editMarkerDialogSelectType,
                editMarkerDialogInputRadius,
                editMarkerDialogInputContent
              )
            "
            >保存</v-btn
          >
        </template>
      </ConfirmDialog>

      <!-- 移除标记对话框 -->
      <ConfirmDialog
        v-if="selectMarker && selectMarker.markerMode === 'markLocation'"
        v-model="removeMarkerDialog"
        :custom="true"
        title="移除标记"
        color="primaryMission"
        :confirm-auto-close="false"
        :loading="modifyMarkerLoading"
        @confirm="removeMarker(selectMarker)"
      >
        <div>
          您将要移除标记<span class="font-weight-bold">{{
            selectMarker.markerTitle
          }}</span
          >{{
            selectMarker.markerSubtitle
              ? `(${selectMarker.markerSubtitle})`
              : ''
          }}，确认继续吗？
        </div>
      </ConfirmDialog>

      <!-- 添加标记对话框 -->
      <ConfirmDialog
        v-model="addMarkerDialog"
        title="添加标记"
        :custom="true"
        :custom-confirm-button="true"
        :loading="modifyMarkerLoading"
        color="primaryMission"
      >
        <div class="pb-6">
          <span class="font-weight-bold">{{ addMarkerAddress }}</span>
        </div>
        <v-form ref="addMarkerDialogForm">
          <v-row no-gutters>
            <v-col cols="12">
              <v-select
                v-model="addMarkerDialogSelectTeam"
                class="mr-1"
                :items="teamItems"
                item-text="item"
                item-value="tid"
                color="primaryMission"
                item-color="primaryMission"
                filled
                label="绑定小队"
              ></v-select>
            </v-col>
            <v-col cols="6">
              <v-select
                v-model="addMarkerDialogSelectType"
                class="mr-1"
                :items="markerType"
                color="primaryMission"
                item-color="primaryMission"
                filled
                label="标记类别"
              ></v-select>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="addMarkerDialogInputRadius"
                class="ml-1"
                :disabled="addMarkerDialogSelectType === '标记点'"
                color="primaryMission"
                label="救援区域半径（米）"
                :rules="
                  addMarkerDialogSelectType === '标记点'
                    ? []
                    : [rules.markerRadius]
                "
                filled
                type="Number"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="addMarkerDialogInputContent"
                label="标记备注信息"
                color="primaryMission"
                filled
                rows="2"
                auto-grow
              ></v-textarea>
            </v-col>
          </v-row>
        </v-form>
        <template #confirmButton>
          <v-btn
            class="white--text"
            depressed
            color="primaryMission"
            :disabled="modifyMarkerLoading"
            :loading="modifyMarkerLoading"
            @click="
              addMarker(
                addMarkerLnglat,
                addMarkerAddress,
                addMarkerDialogSelectTeam,
                addMarkerDialogSelectType,
                addMarkerDialogInputRadius,
                addMarkerDialogInputContent
              )
            "
            >保存</v-btn
          >
        </template>
      </ConfirmDialog>

      <!-- 添加 / 取消添加标记按钮 -->
      <FloatButton
        v-if="role === 'leader'"
        :icon="addMarkerMode ? 'mdi-close' : 'mdi-plus'"
        :color="addMarkerMode ? 'grey darken-1' : 'primaryMission'"
        filled
        class="map-fab"
        @click="addMarkerMode = !addMarkerMode"
      />

      <!-- 确认添加标记按钮 -->
      <FloatButton
        v-if="role === 'leader'"
        v-show="addMarkerMode"
        icon="mdi-check"
        color="primaryMission"
        filled
        class="map-fab"
        style="margin-bottom: 70px"
        @click="addMarkerDialog = true"
      />

      <!-- 任务地图 -->
      <MissionMap
        v-model="map"
        class="map"
        :map-detail="missionMapDetail"
        :map-style="currentMapStyle"
        :select-marker="selectMarker"
        :add-marker-mode="addMarkerMode"
        @setCurrentPosition="setCurrentPosition"
        @setSnackbar="setSnackbar"
        @setSelectMarker="setSelectMarker"
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
</template>

<script>
import MissionMap from '~/components/mission/MissionMap'
import ConfirmDialog from '~/components/modal/ConfirmDialog'
import FloatButton from '~/components/modal/FloatButton'
import Snackbar from '~/components/modal/BottomSnackbar'

export default {
  components: { MissionMap, ConfirmDialog, FloatButton, Snackbar },
  model: {
    prop: 'missionMapDialog',
    event: 'onOpenCloseMissionMapDialog',
  },
  props: {
    missionMapDialog: {
      type: Boolean,
      required: true,
      default: false,
    },
    missionMapDetail: {
      type: Object,
      required: true,
      default: () => ({}),
    },
    missionTeamDetail: {
      type: Array,
      required: true,
      default: () => [],
    },
    role: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    dialog: false,
    // 菜单
    menu: false,
    // 主题颜色
    themeColor: 'primaryMission',
    // 主题颜色深浅
    // 主题颜色较深时应设置为 true，适配文字为白色
    themeDark: true,
    // 底部通知
    snackbar: false,
    snackbarText: '',
    // 地图对象
    map: {},
    // 当前经纬度坐标
    currentPosition: [],
    // 地图选中的 Marker
    selectMarker: {},
    // 小队信息
    teamItems: [],
    // 标记类别
    markerType: ['标记点', '救援区域'],
    // 修改 Marker 对话框加载状态（包括编辑、移除和添加）
    modifyMarkerLoading: false,
    // 编辑 Markder 信息对话框
    editMarkerDialog: false,
    editMarkerDialogSelectTeam: -1, // 绑定的小队
    editMarkerDialogSelectType: undefined, // 选中的标记类别
    editMarkerDialogInputRadius: undefined, // 救援区域半径
    editMarkerDialogInputContent: undefined, // 标记备注信息
    // 移除 Marker 对话框
    removeMarkerDialog: false,
    // 添加 Marker 状态
    addMarkerMode: false,
    addMarkerLnglat: [],
    addMarkerAddress: undefined, // addMarkerLnglat 的逆编码地址
    // 添加 Marker 对话框
    addMarkerDialog: false,
    addMarkerDialogSelectTeam: -1,
    addMarkerDialogSelectType: undefined, // 选中的标记类别
    addMarkerDialogInputRadius: undefined, // 救援区域半径
    addMarkerDialogInputContent: undefined, // 标记备注信息
    // 修改 Marker 对话框表单验证
    rules: {
      markerRadius: (value) => value > 0 || '救援区域半径应大于 0 米',
    },
    // 地图主题
    // https://developer.amap.com/demo/jsapi-v2/example/personalized-map/set-theme-style
    currentMapStyle: 'amap://styles/whitesmoke',
    mapStyle: [
      {
        id: 0,
        style: 'amap://styles/macaron',
        color: '',
        dark: true,
      },
      {
        id: 1,
        style: 'amap://styles/normal',
        color: 'primaryMission',
        dark: true,
      },
      {
        id: 2,
        style: 'amap://styles/whitesmoke',
        color: '',
        dark: true,
      },
      {
        id: 3,
        style: 'amap://styles/grey',
        color: '',
        dark: true,
      },
      {
        id: 4,
        style: 'amap://styles/dark',
        color: '',
        dark: true,
      },
    ],
  }),
  watch: {
    missionMapDialog(newVal) {
      this.dialog = newVal
    },
    dialog(newVal) {
      this.$emit('onOpenCloseMissionMapDialog', newVal)
    },
    // 任务的队伍信息发生改变时，刷新当前页面的 teamItems
    missionTeamDetail() {
      this.getTeamItems()
    },
    // 监听打开编辑标记点对话框
    editMarkerDialog(newVal) {
      if (newVal) {
        const marker = this.selectMarker
        if (marker && marker.markerMode) {
          // 标记合法时，初始化对话框表单信息
          // 设置绑定小队信息
          this.editMarkerDialogSelectTeam = marker.markerTid || -1
          // 标记存在 markerRadius 项时，为救援区域
          this.editMarkerDialogSelectType = marker.markerRadius
            ? '救援区域'
            : '标记点'
          // 设置救援区域半径
          this.editMarkerDialogInputRadius = marker.markerRadius || undefined
          // 设置标记点备注信息
          this.editMarkerDialogInputContent = marker.markerContent || undefined
        } else {
          // 标记不合法，关闭此对话框
          this.editMarkerDialog = false
        }
      }
    },
    // 监听打开添加标记点对话框
    addMarkerDialog(newVal) {
      if (newVal) {
        const map = this.map
        const that = this

        // 设置加载状态
        this.modifyMarkerLoading = true

        // 初始化添加标记对话框表单
        this.addMarkerDialogSelectTeam = -1
        this.addMarkerDialogSelectType = '标记点'
        this.addMarkerDialogInputRadius = undefined
        this.addMarkerDialogInputContent = undefined

        // 获取当前地图的中心点坐标
        const center = map.getCenter()
        const lnglat = [center.lng, center.lat]
        this.addMarkerLnglat = lnglat

        // 获取中心点坐标的地理逆编码地址
        this.addMarkerAddress = '正在获取地址信息...'
        let address = '标记地点'
        // eslint-disable-next-line no-undef
        const geocoder = new AMap.Geocoder({
          radius: 500,
        })
        geocoder.getAddress(lnglat, function (status, result) {
          if (status === 'complete' && result.regeocode) {
            // 获取逆编码地址成功
            address = result.regeocode.formattedAddress
          }
          that.addMarkerAddress = address
          // 取消加载状态
          that.modifyMarkerLoading = false
        })
      }
    },
  },
  created() {
    this.dialog = this.missionMapDialog
    this.getTeamItems()
  },
  methods: {
    // 获取小队信息
    getTeamItems() {
      const teamItems = [
        {
          tid: -1,
          item: '不绑定小队',
        },
      ]
      for (const team of this.missionTeamDetail) {
        teamItems.push({
          tid: team.tid,
          item: `第 ${team.tid} 小队`,
        })
      }
      this.teamItems = teamItems
    },
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
    // 手动刷新地图
    reInitMissionMap() {
      this.$Bus.$emit('reInitMissionMap')
    },
    // 获取当前定位
    getCurrentPosition() {
      this.$Bus.$emit('getMissionMapCurrentPostion')
    },
    // 保存当前定位信息
    setCurrentPosition(lnglat) {
      this.currentPosition = lnglat
    },
    // 适配当前视野范围
    setFitView() {
      this.$Bus.$emit('setMissionMapFitView')
    },
    // 设置地图主题
    setMapStyle(select) {
      const selectMapStyle = this.mapStyle[select]
      this.currentMapStyle = selectMapStyle.style
    },
    // 获取当前点击的 Marker 信息
    setSelectMarker(marker) {
      this.selectMarker = marker
    },
    // TODO: 编辑标记点内容
    editMarkerInfo(marker, tid, type, radius, content) {
      if (!this.$refs.editMarkerDialogForm.validate()) {
        // 表单验证失败
        return false
      }

      if (marker && marker.markerMode) {
        // 标记有效时
        this.modifyMarkerLoading = true

        const modifiedMarkder = {
          name: marker.markerTitle,
          lnglat: marker.markerCenter,
          content,
        }

        if (tid !== -1) {
          modifiedMarkder.tid = tid
        }

        if (type === '救援区域') {
          modifiedMarkder.radius = radius
        }

        // 保存信息
        const missionMapDetail = this.missionMapDetail
        const lnglat = marker.markerCenter.join(',') // 通过坐标信息判断是否为目标点
        switch (marker.markerMode) {
          case 'markLocation':
            // 对于志愿者的标记
            for (let i = 0; i < missionMapDetail.markLocation.length; i++) {
              if (
                lnglat === missionMapDetail.markLocation[i].lnglat.join(',')
              ) {
                // 找到修改的坐标信息时
                missionMapDetail.markLocation[i] = modifiedMarkder
                break
              }
            }
            break
          case 'starLocation':
            // 对于老人常去地点
            for (let i = 0; i < missionMapDetail.starLocation.length; i++) {
              if (
                lnglat === missionMapDetail.starLocation[i].lnglat.join(',')
              ) {
                // 找到修改的坐标信息时
                missionMapDetail.starLocation[i] = modifiedMarkder
                break
              }
            }
            break
          case 'lastKnownLocation':
            // 对于老人走失地点
            missionMapDetail.lastKnownLocation = modifiedMarkder
            break
        }
        // TODO: 保存信息到数据库

        // 刷新数据到 mission.missionMapDetail
        this.$Bus.$emit('modifyMissionInfo', {
          missionMapDetail,
        })

        // 重新渲染地图覆盖物
        this.$Bus.$emit('reInitMissionMapMarker')

        // 提示修改成功
        this.setSnackbar('修改标记点信息成功！')

        this.modifyMarkerLoading = false
        this.editMarkerDialog = false
      } else {
        return false
      }
    },
    // TODO: 移除标记点
    removeMarker(marker) {
      // 只能移除志愿者标注的标记点
      if (marker && marker.markerMode === 'markLocation') {
        this.modifyMarkerLoading = true

        const missionMapDetail = this.missionMapDetail
        const lnglat = marker.markerCenter.join(',')

        // 删除对应的点
        for (let i = 0; i < missionMapDetail.markLocation.length; i++) {
          if (lnglat === missionMapDetail.markLocation[i].lnglat.join(',')) {
            missionMapDetail.markLocation.splice(i, 1)
            break
          }
        }

        // TODO: 保存信息到数据库

        // 刷新数据到 mission.missionMapDetail
        this.$Bus.$emit('modifyMissionInfo', {
          missionMapDetail,
        })

        // 重新渲染地图覆盖物
        this.$Bus.$emit('reInitMissionMapMarker')

        // 提示删除成功
        this.setSnackbar('删除标记点成功！')

        this.modifyMarkerLoading = false
        this.removeMarkerDialog = false
      }
    },
    // TODO: 添加标记点
    addMarker(lnglat, address, tid, type, radius, content) {
      if (!this.$refs.addMarkerDialogForm.validate()) {
        // 表单验证失败
        return false
      }

      this.modifyMarkerLoading = true
      const marker = {
        name: address,
        lnglat,
        content,
      }

      if (tid !== -1) {
        marker.tid = tid
      }

      if (type === '救援区域') {
        marker.radius = radius
      }

      // TODO: 保存信息到数据库

      const missionMapDetail = this.missionMapDetail
      missionMapDetail.markLocation.push(marker)
      this.$Bus.$emit('modifyMissionInfo', {
        missionMapDetail,
      })
      this.$Bus.$emit('reInitMissionMapMarker')
      this.setSnackbar('您已成功添加标记点！')

      // 关闭添加标记点状态
      this.addMarkerMode = false

      this.modifyMarkerLoading = false
      this.addMarkerDialog = false
    },
    // 调用高德地图 URI 规划路径
    getNavigation(from, to, toName = '目标地点') {
      window.open(
        `https://uri.amap.com/navigation?from=${from[0]},${from[1]},当前位置&to=${to[0]},${to[1]},${toName}&src=归家行动&callnative=1`,
        '_blank'
      )
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

.map-info-window {
  position: fixed;
  z-index: 999;
  margin-top: 88px;
  max-width: 308px;
}

.map-fab {
  z-index: 999;
}

.map-snackbar {
  z-index: 999;
}
</style>
