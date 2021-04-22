<template>
  <!-- 救援召集中打开任务详情页面 -->
  <div>
    <v-dialog
      v-model="convenerDetailDialog"
      fullscreen
      hide-overlay
      persistent
      no-click-animation
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar
          class="dialog-toolbar"
          dark
          color="primaryConvener"
          width="100%"
        >
          <v-btn icon dark @click="convenerDetailDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title class="px-3">任务详情</v-toolbar-title>
        </v-toolbar>
        <div class="dialog-container px-3">
          <!-- <ContentTitle>任务信息</ContentTitle>
          <MissionDetail :mission-detail="mission.missionDetail" /> -->
          <ContentTitle>走失老人信息</ContentTitle>
          <v-card class="rounded-lg" outlined>
            <MissionLostOldDetail :lost-old-detail="mission.lostOldDetail" />
          </v-card>
        </div>
        <v-toolbar class="dialog-bottom-toolbar" width="100%" elevation="1">
          <v-spacer />
          <v-toolbar-items>
            <!-- 指挥可以拒绝和通过任务审核，也可以接受并参与任务 -->
            <v-btn
              v-if="missionStatus === 0 && role === 'leader'"
              depressed
              color="red darken-1"
              dark
              @click="refuseMissionConfirmDialog = true"
              >拒绝任务</v-btn
            >
            <v-btn
              v-if="
                (missionStatus === -1 || missionStatus === 0) &&
                role === 'leader'
              "
              depressed
              :class="missionStatus === 0 ? 'ml-2' : ''"
              color="primaryConvener"
              dark
              @click="verifyMissionConfirmDialog = true"
              >通过审核</v-btn
            >
            <!-- 志愿者可以接受并参与任务 -->
            <v-btn
              v-if="missionStatus === 1 || missionStatus === 2"
              depressed
              color="primaryConvener"
              dark
              @click="acceptMissionConfirmDialog = true"
              >接受任务</v-btn
            >
            <v-btn depressed class="ml-2" @click="convenerDetailDialog = false">
              关闭任务详情
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
      </v-card>
    </v-dialog>

    <ConfirmDialog
      v-model="refuseMissionConfirmDialog"
      title="拒绝任务"
      text="任务审核拒绝后您也随时可以启动此任务，您确定要拒绝此任务吗？"
      color="primaryConvener"
      @confirm="refuseMission()"
    />
    <ConfirmDialog
      v-model="verifyMissionConfirmDialog"
      title="通过审核"
      text="通过审核的任务将会开始召集志愿者，您确定要启动此任务吗？"
      color="primaryConvener"
      @confirm="verifyMission()"
    />
    <ConfirmDialog
      v-model="acceptMissionConfirmDialog"
      title="接受任务"
      text="您确定要接受此任务吗？"
      color="primaryConvener"
      @confirm="acceptMission()"
    />
  </div>
</template>

<script>
import ContentTitle from '~/components/modal/ContentTitle'
// import MissionDetail from '~/components/mission/MissionDetail'
import MissionLostOldDetail from '~/components/modal/LostOldDetail'
import ConfirmDialog from '~/components/modal/ConfirmDialog'

export default {
  components: {
    ContentTitle,
    // MissionDetail,
    MissionLostOldDetail,
    ConfirmDialog,
  },
  props: {
    role: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    convenerDetailDialog: false,
    mission: {},
    missionStatus: -2,
    refuseMissionConfirmDialog: false,
    verifyMissionConfirmDialog: false,
    acceptMissionConfirmDialog: false,
  }),
  watch: {
    // convenerDetailDialog(newVal) {
    //   if (newVal === false) {
    //     this.mission = {}
    //   }
    // },
  },
  mounted() {
    this.$Bus.$on('openConvenerDetailDialog', (msg) => {
      this.mission = msg.mission
      this.missionStatus = msg.mission.missionDetail.status
      this.convenerDetailDialog = true
    })
  },
  methods: {
    // TODO: 指挥拒绝任务
    refuseMission() {
      console.log(`拒绝任务，任务 id: ${this.mission.missionDetail.missionId}`)
    },
    // TODO: 指挥审核通过任务
    // 通过的任务将立即开始召集志愿者，并创建飞书群聊
    // 通过的任务等级默认为最高的一级
    verifyMission() {
      console.log(`启动任务，任务 id: ${this.mission.missionDetail.missionId}`)
    },
    // TODO: 接受任务
    acceptMission() {
      console.log(`接受任务，任务 id: ${this.mission.missionDetail.missionId}`)
    },
  },
}
</script>
