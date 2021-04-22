<template>
  <!-- 正在进行中的任务 -->
  <div>
    <v-app-bar color="primaryMission" app dark dense fixed>
      <v-toolbar-title
        ><v-icon left>{{ missionToolbarIcon }}</v-icon
        >{{ missionToolbarTitle }}</v-toolbar-title
      >
      <v-spacer />
      <v-toolbar-items>
        <v-btn
          class="pl-4 pr-3"
          depressed
          color="teal darken-2"
          dark
          @click="showMissionLevelIntro"
        >
          <v-icon left>mdi-android-auto</v-icon
          ><span> {{ missionLevel }}任务 </span>
        </v-btn>

        <v-btn
          class="ml-1 pl-4 pr-3"
          depressed
          color="teal darken-2"
          dark
          @click="showMissionPastTime"
        >
          <v-icon left>mdi-clock-time-four</v-icon>
          <span>
            {{ missionPastTime }}
          </span>
        </v-btn>
      </v-toolbar-items>
      <template #extension>
        <v-tabs
          v-model="tabsModel"
          center-active
          centered
          slider-color="#FFF59D"
        >
          <v-tab v-for="tab in tabs" :key="tab.name" :href="`#${tab.name}`">{{
            tab.label
          }}</v-tab>
        </v-tabs>
      </template>
    </v-app-bar>

    <v-tabs-items v-model="tabsModel" class="fullscreen-page" continuous>
      <v-tab-item value="missionLostOldInfoTab" class="tab-background">
        <MissionLostOldDetailTab :mission="mission" :role="role" />
      </v-tab-item>
      <v-tab-item value="missionCenterTab" class="tab-background">
        <MissionCenterTab :mission="mission" :role="role" />
      </v-tab-item>
      <v-tab-item value="missionTeamTab" class="tab-background">
        <MissionTeamTab :mission="mission" :role="role" />
      </v-tab-item>
    </v-tabs-items>

    <!-- 底部通知 -->
    <BottomSnackbar
      v-model="snackbar"
      color="primaryMission"
      :text="snackbarText"
    />

    <MissionMapDialog
      v-model="missionMapDialog"
      :mission-map-detail="mission.missionMapDetail"
      :mission-team-detail="mission.missionTeamDetail"
      :role="role"
    />
    <MissionOpenMapButton @openMissionMap="openMissionMapDialog" />
  </div>
</template>

<script>
import BottomSnackbar from '~/components/modal/BottomSnackbar'
import MissionLostOldDetailTab from '~/components/mission/MissionLostOldDetailTab'
import MissionCenterTab from '~/components/mission/MissionCenterTab'
import MissionTeamTab from '~/components/mission/MissionTeamTab'
import MissionOpenMapButton from '~/components/mission/MissionOpenMapButton'
import MissionMapDialog from '~/components/mission/MissionMapDialog'

export default {
  components: {
    BottomSnackbar,
    MissionLostOldDetailTab,
    MissionCenterTab,
    MissionTeamTab,
    MissionOpenMapButton,
    MissionMapDialog,
  },
  data: () => ({
    tabsModel: 'missionCenterTab',
    // 当前执行的任务信息
    // 此处获取的任务信息为详细信息，包括全部四个内容
    // 1: missionDetail 任务的全局信息
    // 2: lostOldDetail 走失老人的信息
    // 3: missionMapDetail 指挥和队长在地图上额外标注的信息
    // 4: missionMemberDetail 参与任务的所有成员及其相关信息，离开任务的成员特别标注 quit = true
    // 5: missionTeamDetail 任务中所有小队的信息，以及其成员的 uid
    mission: {},
    // 根据 mission.missionDetail.level 获取任务的等级
    missionLevel: '',
    // 根据 mission.missionDetail.startTime 获取任务已经过时间
    missionPastTime: '',
    missionPastTimeTimer: null,
    // 任务地图对话框
    missionMapDialog: false,
    // 底部通知
    snackbar: false,
    snackbarText: '',
    // 志愿者身份
    role: '',
  }),
  computed: {
    // 上方 toolbar 根据志愿者身份显示不同内容
    missionToolbarIcon() {
      switch (this.role) {
        case 'volunteer':
          return 'mdi-account'
        case 'leader':
          return 'mdi-account-tie'
        default:
          return ''
      }
    },
    missionToolbarTitle() {
      switch (this.role) {
        case 'volunteer':
          return '志愿者'
        case 'leader':
          return '志愿者领队'
        default:
          return ''
      }
    },
    // 根据志愿者身份显示不同的 tab 标签
    tabs() {
      switch (this.role) {
        case 'volunteer':
          return [
            {
              name: 'missionLostOldInfoTab',
              label: '老人信息',
            },
            {
              name: 'missionCenterTab',
              label: '任务总览',
            },
            {
              name: 'missionTeamTab',
              label: '我的小队',
            },
          ]
        case 'leader':
          return [
            {
              name: 'missionLostOldInfoTab',
              label: '老人信息',
            },
            {
              name: 'missionCenterTab',
              label: '任务总览',
            },
            {
              name: 'missionTeamTab',
              label: '小队列表',
            },
          ]
        default:
          return []
      }
    },
  },
  watch: {
    // 监听路由变化
    $route(to, from) {
      // 当切换到 /volunteer/mission 时启动循环定时器监听任务已经过时间
      // 当切换到其它路由时移除循环定时器
      if (to.path === '/volunteer/mission') {
        this.missionPastTimeTimer = setInterval(() => {
          this.setMissionPastTime(
            this.getMissionPastTime(this.mission.missionDetail.startTime)
          )
        }, 5000)
      } else if (from.path === '/volunteer/mission') {
        clearInterval(this.missionPastTimeTimer)
      }
    },
  },
  created() {
    // 获取志愿者信息
    this.role = localStorage.volunteerRole

    // TODO: 获取任务信息
    this.getMissionInfo()

    // 任务存在时，根据获取的任务信息获取等级和已经过时间
    this.setMissionLevel(this.getMissionLevel(this.mission.missionDetail.level))
    this.setMissionPastTime(
      this.getMissionPastTime(this.mission.missionDetail.startTime)
    )
    // 每 5 秒钟刷新任务已经过的时间
    this.missionPastTimeTimer = setInterval(() => {
      this.setMissionPastTime(
        this.getMissionPastTime(this.mission.missionDetail.startTime)
      )
    }, 5000)
  },
  mounted() {
    // 调用底部的通知
    this.$Bus.$on('openMissionBottomSnackbar', (text) => {
      this.snackbar = false
      this.$nextTick(() => {
        this.snackbarText = text
        this.snackbar = true
      })
    })
    // 其它组件修改 mission 对象时，可以使用此监听事件
    this.$Bus.$on('modifyMissionInfo', (msg) => {
      this.mission.missionDetail =
        msg.missionDetail || this.mission.missionDetail
      this.mission.lostOldDetail =
        msg.lostOldDetail || this.mission.lostOldDetail
      this.mission.missionMapDetail =
        msg.missionMapDetail || this.mission.missionMapDetail
      this.mission.missionMemberDetail =
        msg.missionMemberDetail || this.mission.missionMemberDetail
      this.mission.missionTeamDetail =
        msg.missionTeamDetail || this.mission.missionTeamDetail
    })
  },
  methods: {
    // TODO: 获取当前任务信息
    getMissionInfo() {
      this.mission = {
        missionDetail: {
          missionId: '123',
          status: 1,
          need: 40,
          called: 12,
          level: 1,
          startTime: new Date().getTime() - 100000,
          endTime: new Date().getTime() + 10000000,
          principalName: '张三',
          principalPhone: '123456',
        },
        lostOldDetail: {
          relative: {
            id: new Date().getTime(),
            name: '吴先生',
            telephone: '18980340000',
          },
          mainPhoto: {
            path: '/old-woman.jpg',
          },
          additionalPhoto: [
            {
              path: '/old-man.jpg',
            },
          ],
          name: '周直臻',
          gender: '男',
          age: '89',
          lastKnownLocation: {
            name: 'XXXXXXXXXXXXXXXXXXXXXXXXXXX',
            lnglat: [234, 236],
          },
          starLocation: [
            {
              name: 'XXXXXXXXXXXXXXXXXXXXXXXXXXX',
              lnglat: [123, 15346],
            },
            {
              name: 'XXXXXXXXXXXXXXXXXXXXXXXXXXX',
              lnglat: [315, 1325234],
            },
          ],
          lostDate: '2021-04-04',
          lostTime: '16:26',
          nativePlace: '四川省成都市',
          diseaseHistory: '心脏病',
          posture: '身高180cm左右，体重70kg',
          clothing: '带着绿色的帽子，穿红色的衣服，蓝色牛仔裤，拖鞋',
          otherChara: '长得比较瓜，手上有胎记',
          otherInfo: '可能会偷偷跑去酒吧',
        },
        missionMapDetail: {
          lastKnownLocation: {
            name: '东桂四号院',
            lnglat: [104.130654, 30.644395],
            radius: 100,
          },
          starLocation: [
            {
              name: '塔子山公园',
              lnglat: [104.123912, 30.634898],
            },
            {
              name: '成都市体育运动学校',
              lnglat: [104.129866, 30.640283],
              radius: 100,
            },
          ],
          markLocation: [
            {
              tid: 1,
              name: '救助区小站',
              lnglat: [104.129027, 30.646121],
              radius: 50,
              content: '在救助区小站 50 米内展开搜寻',
            },
            {
              tid: 2,
              name: '佳年华广场',
              lnglat: [104.130987, 30.628134],
            },
          ],
        },
        missionMemberDetail: [
          {
            uid: 123,
            name: '杰哥',
            telephone: '18980340000',
            wechat: '18980340000',
            photo: '',
            quit: false,
          },
          {
            uid: 124,
            name: '伦哥',
            telephone: '18980340001',
            wechat: '18980340001',
            photo: '',
            quit: false,
          },
          {
            uid: 125,
            name: '张哥',
            telephone: '18980340002',
            wechat: '18980340002',
            photo: '',
            quit: true,
            quitReason: '今天下午突然公司要开会',
          },
          {
            uid: 126,
            name: '王姐',
            telephone: '18980340003',
            wechat: '18980340003',
            photo: '',
            quit: false,
          },
          {
            uid: 127,
            name: 'Dio',
            telephone: '18980340004',
            wechat: '18980340004',
            photo: '',
            quit: false,
          },
        ],
        missionTeamDetail: [
          {
            tid: 1,
            members: [123, 125, 126],
            leader: 123,
          },
          {
            tid: 2,
            members: [124, 127],
            leader: 124,
          },
        ],
      }
    },
    getMissionLevel(level) {
      return this.$ValueHandler.getMissionLevelFromValue(level)
    },
    setMissionLevel(levelText) {
      this.missionLevel = levelText
    },
    getMissionPastTime(time) {
      return this.$Dayjs.getTimeToNow(time)
    },
    setMissionPastTime(timeText) {
      this.missionPastTime = timeText
    },
    // 在 snackbar 显示任务优先等级
    showMissionLevelIntro() {
      const missionLevel = this.getMissionLevel(
        this.mission.missionDetail.level
      )
      this.setMissionLevel(missionLevel)
      this.$Bus.$emit('openSnackbar', {
        text: `当前任务为${missionLevel}任务`,
      })
    },
    // 在 snackbar 显示任务已经过时间
    showMissionPastTime() {
      const missionPastTime = this.getMissionPastTime(
        this.mission.missionDetail.startTime
      )
      this.setMissionPastTime(missionPastTime)
      this.$Bus.$emit('openSnackbar', {
        text: `当前任务已经过 ${missionPastTime}`,
      })
    },
    // 打开任务地图对话框
    openMissionMapDialog() {
      this.missionMapDialog = true
    },
  },
}
</script>

<style lang="scss" scoped>
.fullscreen-page {
  min-height: 100vh;
}
</style>
