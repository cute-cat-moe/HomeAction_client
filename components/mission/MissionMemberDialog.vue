<template>
  <!-- 查看参与任务的全部成员页面 -->
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
        <v-toolbar
          class="dialog-toolbar"
          dark
          color="primaryMission"
          width="100%"
        >
          <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title class="px-3">任务成员列表</v-toolbar-title>
          <!-- 志愿者退出任务按钮，小队队长和指挥不可退出任务 -->
          <!-- <v-spacer />
          <v-toolbar-items>
            <v-btn text @click="quitMissionConfirmDialog = true"
              ><v-icon left>mdi-logout</v-icon>退出任务</v-btn
            >
          </v-toolbar-items> -->
        </v-toolbar>
        <div class="dialog-container">
          <v-container class="pa-2">
            <v-row no-gutters>
              <v-col v-show="loading" cols="12" align="center">
                <Loading v-model="loading" text="正在获取成员信息" />
              </v-col>

              <v-col
                v-for="member in missionMemberAndTeamList"
                :key="member.uid"
                cols="6"
                align="center"
                class="pa-2"
              >
                <MissionMemberCard :member-info="member" />
              </v-col>
            </v-row>
          </v-container>
        </div>
        <v-toolbar class="dialog-bottom-toolbar" width="100%" elevation="1">
          <v-spacer />
          <v-toolbar-items>
            <v-btn depressed @click="dialog = false">关闭成员列表</v-btn>
          </v-toolbar-items>
        </v-toolbar>
      </v-card>
    </v-dialog>

    <!-- <QuitMissionConfirmDialog
      v-model="quitMissionConfirmDialog"
      title="退出任务"
      text="退出任务后您将可以参加新的任务；但回到当前任务后您仍将隶属于当前的小队。您确定要退出任务吗？"
      color="primaryMission"
      confirm-input="确认退出"
      @confirm="quitMission(missionId)"
    /> -->
  </div>
</template>

<script>
import Loading from '~/components/modal/Loading'
// import QuitMissionConfirmDialog from '~/components/modal/ConfirmDialog'
import MissionMemberCard from '~/components/mission/MissionMemberCard'

export default {
  components: { Loading, MissionMemberCard },
  model: {
    prop: 'missionMemberDialog',
    event: 'onOpenCloseMissionMemberDialog',
  },
  props: {
    missionMemberDialog: {
      type: Boolean,
      required: true,
    },
    // 任务的成员列表
    missionMemberList: {
      type: Array,
      required: true,
    },
    // 任务的小队列表，用于标记成员隶属小队
    missionTeamList: {
      type: Array,
      required: true,
    },
    // 任务的编号，用于标记志愿者退出任务
    // missionId: {
    //   type: String,
    //   required: true,
    // },
  },
  data: () => ({
    dialog: false,
    // quitMissionConfirmDialog: false,
    missionMemberAndTeamList: [],
    loading: true,
  }),
  watch: {
    missionMemberDialog(newVal) {
      this.dialog = newVal

      // 首次打开时计算成员信息
      if (newVal && this.missionMemberAndTeamList.length === 0) {
        this.handleMemberAndTeamInfo()
      }
    },
    dialog(newVal) {
      this.$emit('onOpenCloseMissionMemberDialog', newVal)
    },
    // missionMemberList 或 missionTeamList 改变时计算成员信息
    missionMemberList() {
      this.handleMemberAndTeamInfo()
    },
    missionTeamList() {
      this.handleMemberAndTeamInfo()
    },
  },
  created() {
    this.dialog = this.missionMemberDialog
  },
  methods: {
    // TODO: 退出当前任务
    // quitMission(missionId) {
    //   console.log(`退出当前任务，任务编号为 ${missionId}`)
    //   this.dialog = false
    // },
    // 处理志愿者和小队的关系
    // 为每个 member 添加 tid 属性，另外为队长添加 leader 属性
    handleMemberAndTeamInfo() {
      // 设置加载状态
      this.loading = true

      const missionMemberAndTeamList = []
      const missionTeamList = this.missionTeamList
      const missionMemberList = this.missionMemberList

      // 处理志愿者和小队之间的逻辑关系
      for (let n = 0, mLeng = missionMemberList.length; n < mLeng; n++) {
        const memberInfo = missionMemberList[n]
        for (let i = 0, tLeng = missionTeamList.length; i < tLeng; i++) {
          if (missionTeamList[i].members.includes(memberInfo.uid)) {
            memberInfo.tid = missionTeamList[i].tid
            if (missionTeamList[i].leader === memberInfo.uid) {
              memberInfo.leader = true
            }
            break
          }
        }
        missionMemberAndTeamList.push(memberInfo)
      }

      // 为页面赋值并取消加载状态
      this.missionMemberAndTeamList = missionMemberAndTeamList
      this.loading = false
    },
  },
}
</script>
