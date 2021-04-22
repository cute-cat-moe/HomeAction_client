<template>
  <!-- 任务总览页面 -->
  <div>
    <ContentTitle>
      任务信息
      <template #action>
        <!-- 点击按钮可以查看参与当前任务的全体成员 -->
        <v-btn icon @click="missionSettingsDialog = true"
          ><v-icon>mdi-cog-outline</v-icon></v-btn
        >
      </template>
    </ContentTitle>
    <MissionDetail />
    <!-- 任务的额外操作 -->
    <v-row justify="center" no-gutters>
      <v-col
        v-for="(action, index) in missionCenterActions"
        :key="index"
        :cols="actionCols"
        class="px-1 pb-2"
        align="center"
      >
        <v-card
          class="py-4 rounded-lg"
          elevation="0"
          @click="handleActionClick(action)"
        >
          <div class="pt-2">
            <v-icon large>{{ action.icon }}</v-icon>
          </div>
          <div class="pt-2 body-2 opacity-secondary">{{ action.text }}</div>
        </v-card>
      </v-col>
    </v-row>

    <!-- 任务公告栏 -->
    <!-- 只有指挥和小队队长可以发表公告 -->
    <ContentTitle>
      任务公告栏
      <template #action>
        <v-btn
          v-if="role === 'leader'"
          icon
          @click="missionMessageAddDialog = true"
          ><v-icon>mdi-feather</v-icon></v-btn
        >
      </template>
    </ContentTitle>
    <MissionMessageBoard v-model="missionMessage" />
    <MissionMessageAddDialog
      v-model="missionMessageAddDialog"
      @addMessage="addMissionMessage"
    />

    <!-- 任务行动日记对话框 -->
    <!-- 仅志愿者领队显示 -->
    <MissionDiaryDialog
      v-model="missionDiaryDialog"
      :mission-id="mission.missionDetail.missionId"
    />

    <!-- 任务反馈对话框 -->
    <MissionFeedbackDialog
      v-model="missionFeedbackDialog"
      :mission-member-list="mission.missionMemberDetail"
      :mission-team-list="mission.missionTeamDetail"
      :mission-id="mission.missionDetail.missionId"
    />

    <!-- 任务识别老人对话框 -->
    <MissionLostOldRecognitionDialog
      v-model="missionLostOldRecognitionDialog"
      :mission-detail="mission.missionDetail"
      :lost-old-detail="mission.lostOldDetail"
    />

    <!-- 任务设置对话框，只有指挥可以设置 -->
    <MissionSettingsDialog
      v-model="missionSettingsDialog"
      :mission-detail="mission.missionDetail"
      :role="role"
    />

    <!-- 任务成员对话框，显示参加当前任务的所有成员 -->
    <MissionMemberDialog
      v-model="missionMemberDialog"
      :mission-member-list="mission.missionMemberDetail"
      :mission-team-list="mission.missionTeamDetail"
      :mission-id="mission.missionDetail.missionId"
    />
  </div>
</template>

<script>
import ContentTitle from '~/components/modal/ContentTitle'
import MissionDetail from '~/components/mission/MissionDetail'
import MissionSettingsDialog from '~/components/mission/MissionSettingsDialog'
import MissionDiaryDialog from '~/components/mission/MissionDiaryDialog'
import MissionFeedbackDialog from '~/components/mission/MissionFeedbackDialog'
import MissionLostOldRecognitionDialog from '~/components/mission/MissionLostOldRecognitionDialog'
import MissionMemberDialog from '~/components/mission/MissionMemberDialog'
import MissionMessageBoard from '~/components/mission/MissionMessageBoard'
import MissionMessageAddDialog from '~/components/mission/MissionMessageAddDialog'

export default {
  components: {
    ContentTitle,
    MissionDetail,
    MissionSettingsDialog,
    MissionDiaryDialog,
    MissionFeedbackDialog,
    MissionLostOldRecognitionDialog,
    MissionMemberDialog,
    MissionMessageBoard,
    MissionMessageAddDialog,
  },
  props: {
    mission: {
      type: Object,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    missionSettingsDialog: false,
    missionDiaryDialog: false,
    missionFeedbackDialog: false,
    missionLostOldRecognitionDialog: false,
    missionMemberDialog: false,
    missionMessageAddDialog: false,
    missionMessage: [],
    // 通知
    snackbar: false,
    snackbarText: '',
  }),
  computed: {
    // 根据用户角色显示操作按钮
    missionCenterActions() {
      switch (this.role) {
        case 'volunteer':
          return [
            {
              icon: 'mdi-file-document-edit-outline',
              text: '任务反馈',
            },
            {
              icon: 'mdi-camera-outline',
              text: '识别老人',
            },
            {
              icon: 'mdi-account-group-outline',
              text: '查看成员',
            },
          ]
        case 'leader':
          return [
            {
              icon: 'mdi-book-open-page-variant-outline',
              text: '行动日记',
            },
            {
              icon: 'mdi-file-document-edit-outline',
              text: '任务反馈',
            },
            {
              icon: 'mdi-camera-outline',
              text: '识别老人',
            },
            {
              icon: 'mdi-account-group-outline',
              text: '查看成员',
            },
          ]
        default:
          return ''
      }
    },
    // 根据用户角色修改操作按钮大小
    actionCols() {
      switch (this.role) {
        case 'volunteer':
          return '4'
        case 'leader':
          return '3'
        default:
          return '0'
      }
    },
  },
  created() {
    this.initMissionMessage()
  },
  mounted() {},
  methods: {
    // 处理点击的不同任务操作
    handleActionClick(action) {
      // 根据操作的 text 项执行命令
      switch (action.text) {
        case '行动日记':
          this.missionDiaryDialog = true
          break
        case '任务反馈':
          this.missionFeedbackDialog = true
          break
        case '识别老人':
          this.missionLostOldRecognitionDialog = true
          break
        case '查看成员':
          this.missionMemberDialog = true
          break
      }
    },
    // TODO: 读取任务公告板信息
    initMissionMessage() {
      this.missionMessage = [
        {
          type: 'danger',
          time: new Date().getTime() - 10000,
          content:
            'Whether the disable of the top-pull throttle event is triggered to ensure performance if the real-time trigger is set to false.',
          member: {
            uid: 1009,
            name: '绿豆',
            avatar: '',
          },
        },
        {
          type: 'info',
          time: new Date().getTime() - 100000,
          content:
            'The height of the block element area outside the top of the scroll container.',
          member: {
            uid: 1010,
            name: '黄豆',
            avatar: '',
          },
        },
        {
          time: new Date().getTime() - 1000000,
          content: '这是一条公告信息，请收到的同学举手！',
          member: {
            uid: 1011,
            name: '憨豆',
            avatar: '',
          },
        },
      ]
    },
    // TODO: 添加任务公告栏消息
    addMissionMessage(msg) {
      const content = msg.content
      // 内容不能为空
      if (!!content === false) {
        return
      }

      // 从 mission.missionMemberDetail 获取成员资料
      const uid = 123
      let member
      for (const memberInfo of this.mission.missionMemberDetail) {
        if (memberInfo.uid === uid) {
          member = memberInfo
          break
        }
      }

      // 未找到对应的用户信息
      if (member === undefined) {
        return
      }

      const type = msg.type || 'default'
      const time = msg.time || new Date().getTime()

      // TODO: 添加信息到数据库

      // 通知操作完成
      this.$Bus.$emit(
        'openMissionBottomSnackbar',
        '您成功添加了任务公告信息，信息将同步到飞书群聊'
      )

      // 添加信息到当前页面的公告栏中
      const message = {
        type,
        time,
        content,
        member,
      }
      this.missionMessage.unshift(message)
    },
  },
}
</script>
