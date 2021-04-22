<template>
  <!-- 志愿者撰写的任务行动日记页面 -->
  <!-- 内容可以在个人中心处阅读 -->
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
        <v-toolbar class="dialog-toolbar" dark :color="color" width="100%">
          <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title class="px-3">行动日记</v-toolbar-title>
        </v-toolbar>
        <div class="dialog-container">
          <v-container class="pa-4">
            <v-row no-gutters>
              <v-col cols="12">
                <v-form ref="form" lazy-validation>
                  <v-textarea
                    v-model="content"
                    :rules="[rules.content]"
                    filled
                    label="行动日记信息"
                    auto-grow
                    rows="4"
                    color="primaryMission"
                    clearable
                  ></v-textarea>
                </v-form>
              </v-col>
              <v-col cols="12" align-self="center" align="end">
                <v-btn
                  depressed
                  :color="color"
                  :dark="dark"
                  :disabled="loading"
                  :loading="loading"
                  @click="addDiary"
                  ><v-icon left>mdi-pencil</v-icon>添加</v-btn
                >
              </v-col>
            </v-row>
            <v-divider class="my-6" />
            <v-timeline
              v-if="diary && diary.length !== 0"
              class="pt-0"
              dense
              clipped
            >
              <v-timeline-item
                v-for="(item, index) in diary"
                :key="index"
                fill-dot
                :color="color"
                small
              >
                <v-card class="rounded-lg" outlined elevation="1">
                  <v-card-subtitle class="pb-1" style="font-size: 14px">{{
                    $Dayjs.formatDateTime(item.date, 'YY-MM-DD HH:mm')
                  }}</v-card-subtitle>
                  <v-divider class="mx-3" />
                  <v-card-text class="pb-6" style="font-size: 16px">{{
                    item.content
                  }}</v-card-text>
                </v-card>
              </v-timeline-item>
            </v-timeline>
            <div v-else>
              <v-row>
                <v-col cols="12" align-self="center" align="center">
                  <v-card-subtitle>{{
                    loading ? '正在获取您的行动日记信息' : '您尚未添加行动日记'
                  }}</v-card-subtitle>
                </v-col>
              </v-row>
            </div>
          </v-container>
        </div>
        <v-toolbar class="dialog-bottom-toolbar" width="100%" elevation="1">
          <v-spacer />
          <v-toolbar-items>
            <v-btn depressed @click="dialog = false">关闭页面</v-btn>
          </v-toolbar-items>
        </v-toolbar>
      </v-card>
    </v-dialog>

    <BottomSnackbar v-model="snackbar" :text="snackbarContent" :color="color" />
  </div>
</template>

<script>
import BottomSnackbar from '~/components/modal/BottomSnackbar'

export default {
  components: { BottomSnackbar },
  model: {
    prop: 'missionDiaryDialog',
    event: 'onOpenCloseMissionDiaryDialog',
  },
  props: {
    missionDiaryDialog: {
      type: Boolean,
      required: true,
    },
    missionId: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: false,
      default: 'primaryMission',
    },
    dark: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  data: () => ({
    dialog: false,
    // 正在编写的内容
    content: '',
    // 表单验证
    rules: {
      content: (v) => !!v || '行动日志信息不能为空',
    },
    // 加载状态
    loading: false,
    // 日志内容
    diary: [],
    // 通知
    snackbar: false,
    snackbarContent: '',
  }),
  watch: {
    missionDiaryDialog(newVal) {
      this.dialog = newVal
    },
    dialog(newVal) {
      this.$emit('onOpenCloseMissionDiaryDialog', newVal)
    },
  },
  created() {
    this.dialog = this.missionDiaryDialog
    this.initDiary()
  },
  methods: {
    // TODO: 获取用户已撰写的日志信息
    initDiary() {
      this.loading = true
      const missionId = this.missionId

      this.diary = [
        {
          date: new Date().getTime() - 10000,
          content: '这是一段测试日志信息',
        },
        {
          date: new Date().getTime() - 50000,
          content: '这是另一段测试日志信息',
        },
        {
          date: new Date().getTime() - 150000,
          content: '这是最开始的一段测试日志信息',
        },
      ]

      this.loading = false
    },
    // TODO: 添加日志信息
    addDiary() {
      if (this.$refs.form.validate()) {
        this.loading = true
        this.snackbar = false

        const content = this.content
        const date = new Date().getTime()

        const diary = {
          content,
          date,
        }

        // TODO: 添加到数据库
        const missionId = this.missionId

        // 渲染到当前页面
        this.diary.unshift(diary)

        // 显示提示框
        this.snackbarContent = '成功添加任务行动日记'
        this.snackbar = true

        this.content = ''
        this.$refs.form.reset()
        this.loading = false
      }
    },
    // 初始化输入
    resetInput() {
      this.content = ''
    },
  },
}
</script>
