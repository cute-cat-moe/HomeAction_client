<template>
  <div>
    <!-- 人脸识别老人对话框 -->
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
          <v-toolbar-title class="px-3">识别老人结果</v-toolbar-title>
        </v-toolbar>
        <div class="dialog-container">
          <v-container class="pa-4">
            <v-card
              v-for="(result, index) in recognitionResult"
              :key="index"
              class="rounded-lg mb-4"
              outlined
              elevation="1"
            >
              <v-row no-gutters>
                <v-col cols="12" align-self="center" align="center">
                  <v-img class="rounded-lg" :src="result.photo"></v-img>
                  <v-card-text>{{
                    `有 ${result.result} 的可能性为待寻找老人`
                  }}</v-card-text>
                </v-col>
              </v-row>
            </v-card>
          </v-container>
        </div>
        <v-toolbar class="dialog-bottom-toolbar" width="100%" elevation="1">
          <v-spacer />
          <v-toolbar-items>
            <v-btn depressed class="ml-2" @click="dialog = false"
              >关闭页面</v-btn
            >
          </v-toolbar-items>
        </v-toolbar>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  model: {
    prop: 'missionLostOldRecognitionResultDialog',
    event: 'onOpenCloseMissionLostOldRecognitionResultDialog',
  },
  props: {
    missionLostOldRecognitionResultDialog: {
      type: Boolean,
      required: true,
    },
    missionDetail: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    dialog: false,
    recognitionResult: [],
  }),
  watch: {
    missionLostOldRecognitionResultDialog(newVal) {
      this.dialog = newVal

      // 打开对话框时获取所有人脸识别结果
      if (newVal) {
        this.getRecognitionResult()
      }
    },
    dialog(newVal) {
      this.$emit('onOpenCloseMissionLostOldRecognitionResultDialog', newVal)
    },
  },
  created() {
    this.dialog = this.missionLostOldRecognitionResultDialog
    this.getRecognitionResult()
  },
  methods: {
    // TODO: 获取当前任务的所有人脸识别结果
    getRecognitionResult() {
      const missionId = this.missionDetail.missionId

      // 应按照可能性的大小排序
      this.recognitionResult = [
        {
          photo: '/old-woman.jpg',
          result: '98%',
        },
        {
          photo: '/old-man.jpg',
          result: '19%',
        },
      ]
    },
  },
}
</script>

<style lang="scss" scoped></style>
