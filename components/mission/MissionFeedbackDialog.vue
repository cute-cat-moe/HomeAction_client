<template>
  <!-- 志愿者提交任务反馈，指挥查看任务反馈页面 -->
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
          <v-toolbar-title class="px-3">任务反馈</v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <v-btn
              text
              @click="mode === 'submit' ? (mode = 'view') : (mode = 'submit')"
              ><v-icon left>{{
                mode === 'submit'
                  ? 'mdi-file-document-multiple-outline'
                  : 'mdi-file-document-edit-outline'
              }}</v-icon
              >{{
                mode === 'submit' ? '查看所有任务反馈' : '前往提交任务反馈'
              }}</v-btn
            >
          </v-toolbar-items>
        </v-toolbar>
        <div class="dialog-container">
          <v-container class="pa-4">
            <!-- 提交任务反馈页面 -->
            <div v-show="mode === 'submit'">
              <v-form
                ref="feedbackForm"
                v-model="feedbackFormValid"
                lazy-validation
              >
                <v-row no-gutters>
                  <v-col cols="12">
                    <v-textarea
                      v-model="feedbackForm.feedback"
                      :rules="[rules.feedback]"
                      filled
                      label="任务反馈信息"
                      auto-grow
                      rows="4"
                      color="primaryMission"
                    ></v-textarea>
                  </v-col>
                  <v-col cols="12">
                    <v-textarea
                      v-model="feedbackForm.comment"
                      filled
                      label="备注信息*"
                      auto-grow
                      rows="3"
                      color="primaryMission"
                    ></v-textarea>
                  </v-col>
                </v-row>
              </v-form>
            </div>
            <!-- 查看所有任务反馈信息页面 -->
            <div v-show="mode === 'view'">
              <v-card
                v-for="feedback in missionFeedback"
                :key="feedback.id"
                class="rounded-lg mb-4"
                outlined
                elevation="1"
              >
                <v-card-title class="feedback-title pb-1">{{
                  feedback.name
                }}</v-card-title>
                <v-divider class="mx-2" />
                <v-card-subtitle class="feedback-subtitle pt-1">
                  {{ $Dayjs.formatDateTime(feedback.date, 'MM-DD hh:mm')
                  }}{{ feedback.tid ? `，第 ${feedback.tid} 小队` : '' }}
                </v-card-subtitle>
                <v-card-text class="feedback-content">
                  {{ feedback.feedback }}
                </v-card-text>
                <v-card-text
                  v-if="feedback.comment"
                  class="feedback-content pt-0"
                >
                  <span class="opacity-secondary">备注 </span>
                  {{ feedback.comment }}</v-card-text
                >
              </v-card>
            </div>
          </v-container>
        </div>
        <v-toolbar class="dialog-bottom-toolbar" width="100%" elevation="1">
          <v-spacer />
          <v-toolbar-items>
            <v-btn
              v-show="mode === 'submit'"
              depressed
              color="primaryMission"
              dark
              @click="toSubmitFeedbackDialog()"
              >提交任务反馈</v-btn
            >
            <v-btn depressed class="ml-2" @click="dialog = false"
              >关闭页面</v-btn
            >
          </v-toolbar-items>
        </v-toolbar>
      </v-card>
    </v-dialog>

    <FeedbackConfirmDialog
      v-model="feedbackConfirmDialog"
      title="提交任务反馈"
      text="您确认要提交搜寻老人任务执行情况反馈吗？"
      color="primaryMission"
      @confirm="submitFeedback(missionId)"
    />
  </div>
</template>

<script>
import FeedbackConfirmDialog from '~/components/modal/ConfirmDialog'

export default {
  components: { FeedbackConfirmDialog },
  model: {
    prop: 'missionFeedbackDialog',
    event: 'onOpenCloseMissionFeedbackDialog',
  },
  props: {
    missionFeedbackDialog: {
      type: Boolean,
      required: true,
    },
    missionId: {
      type: String,
      required: true,
    },
    missionMemberList: {
      type: Array,
      required: true,
    },
    missionTeamList: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    dialog: false,
    feedbackConfirmDialog: false,
    feedbackFormValid: true,
    // 任务反馈的模式
    // 'submit' 表示提交任务反馈模式，'view' 表示查看所有任务反馈模式
    mode: 'submit',
    // 提交的任务反馈表单
    feedbackForm: {
      feedback: '',
      comment: '',
    },
    // 任务反馈表单验证
    rules: {
      feedback: (v) => !!v || '您需要填写任务反馈信息',
    },
    // 当前任务的所有任务反馈信息
    // id: 任务反馈信息的索引
    // date: 反馈提交时间
    // uid: 提交反馈者的用户编号，获取用户姓名和所在小队
    // name: 用户姓名，通过 uid 获取
    // tid: 小队编号，通过 uid 获取
    // feedback: 反馈的主要内容
    // comment: 反馈的备注内容
    missionFeedback: [],
  }),
  watch: {
    missionFeedbackDialog(newVal) {
      this.dialog = newVal
    },
    dialog(newVal) {
      this.$emit('onOpenCloseMissionFeedbackDialog', newVal)
    },
  },
  created() {
    this.dialog = this.missionFeedbackDialog
    this.getMissionFeedback()
  },
  methods: {
    toSubmitFeedbackDialog() {
      if (this.$refs.feedbackForm.validate()) {
        // 表单校验成功
        this.feedbackConfirmDialog = true
      }
    },
    // TODO: 添加任务反馈信息
    submitFeedback(missionId) {
      console.log(`添加任务反馈，任务编号 ${missionId}`)

      // 关闭当前对话框
      this.dialog = false
      // 清除表单信息
      this.$refs.feedbackForm.reset()
    },
    // TODO: 获取任务所有反馈信息
    // 任务反馈信息按时间降序排列
    getMissionFeedback(missionId) {
      const missionFeedback = [
        {
          id: 2,
          date: new Date().getTime(),
          uid: 123,
          feedback: '这是一段任务反馈信息',
          comment: '这是一段任务反馈信息的备注内容',
        },
        {
          id: 1,
          date: new Date().getTime() - 1000000,
          uid: 124,
          feedback: '这也是一段任务反馈信息',
          comment: '这同样是一段任务反馈信息的备注内容',
        },
      ]

      // 获取用户的 name 和 tid 字段
      const missionMemberListLeng = this.missionMemberList.length
      const missionTeamListLeng = this.missionTeamList.length
      for (const feedback of missionFeedback) {
        const uid = feedback.uid

        for (let i = 0; i < missionMemberListLeng; i++) {
          if (this.missionMemberList[i].uid === uid) {
            feedback.name = this.missionMemberList[i].name
          }
        }

        for (let i = 0; i < missionTeamListLeng; i++) {
          if (this.missionTeamList[i].members.includes(uid)) {
            feedback.tid = this.missionTeamList[i].tid
          }
        }
      }

      this.missionFeedback = missionFeedback
    },
  },
}
</script>

<style lang="scss" scoped>
.feedback-title {
  font-size: 20px;
}

.feedback-subtitle {
  font-size: 14px;
}

.feedback-content {
  font-size: 16px;
}
</style>
