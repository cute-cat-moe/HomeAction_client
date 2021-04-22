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
          <v-toolbar-title class="px-3">识别老人</v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <v-btn text :disabled="loading" @click="reset()">重置页面</v-btn>
            <v-btn class="ml-2" text @click="recognitionResultDialog = true"
              >识别结果</v-btn
            >
          </v-toolbar-items>
        </v-toolbar>
        <div class="dialog-container">
          <v-container class="pa-4">
            <v-row no-gutters>
              <v-col cols="12" align-self="center">
                <v-card elevation="0">
                  <v-card-title class="pb-2"> 人脸识别结果 </v-card-title>
                  <v-card-text class="pb-0" style="font-size: 16px">{{
                    result !== ''
                      ? `识别老人的结果：有 ${result} 的可能性为待寻找老人`
                      : '您需要上传进行人脸识别的照片并执行识别操作'
                  }}</v-card-text>
                  <v-divider class="mx-2 my-4" />
                  <v-file-input
                    v-model="selectPhoto"
                    accept="image/*"
                    prepend-icon="mdi-camera"
                    filled
                    label="从相册上传照片进行人脸识别"
                    color="primaryMission"
                    class="mx-4"
                  ></v-file-input>
                  <v-row>
                    <v-col v-if="selectPhotoSrc" cols="12">
                      <v-img class="rounded-lg" :src="selectPhotoSrc"></v-img>
                    </v-col>
                    <v-col cols="12">
                      <v-img
                        class="rounded-lg"
                        :src="lostOldDetail.mainPhoto.path"
                      ></v-img>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </div>
        <v-toolbar
          class="dialog-bottom-toolbar"
          style="z-index: 1"
          width="100%"
          elevation="1"
        >
          <v-spacer />
          <v-toolbar-items>
            <v-btn
              depressed
              color="primaryMission"
              class="white--text"
              :disabled="!selectPhotoSrc || loading"
              @click="recognize()"
              >识别老人</v-btn
            >
            <v-btn depressed class="ml-2" @click="dialog = false"
              >关闭页面</v-btn
            >
          </v-toolbar-items>
        </v-toolbar>
        <v-overlay :value="loading" z-index="2">
          <v-progress-circular indeterminate size="64"></v-progress-circular>
        </v-overlay>
      </v-card>
    </v-dialog>

    <MissionLostOldRecognitionResultDialog
      v-model="recognitionResultDialog"
      :mission-detail="missionDetail"
    />

    <BottomSnackbar
      v-model="snackbar"
      :text="snackbarText"
      color="primaryMission"
    />
  </div>
</template>

<script>
import MissionLostOldRecognitionResultDialog from '~/components/mission/MissionLostOldRecognitionResultDialog'
import BottomSnackbar from '~/components/modal/BottomSnackbar'

export default {
  components: { MissionLostOldRecognitionResultDialog, BottomSnackbar },
  model: {
    prop: 'missionLostOldRecognitionDialog',
    event: 'onOpenCloseMissionLostOldRecognitionDialog',
  },
  props: {
    missionLostOldRecognitionDialog: {
      type: Boolean,
      required: true,
    },
    missionDetail: {
      type: Object,
      required: true,
    },
    lostOldDetail: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    dialog: false,
    // 选择相片
    selectPhoto: null,
    selectPhotoSrc: '',
    // 识别老人加载时设置 loading 为 true
    loading: false,
    // 识别老人结果
    result: '',
    // 识别老人结果页面
    recognitionResultDialog: false,
    // 消息条
    snackbar: false,
    snackbarText: '',
  }),
  watch: {
    missionLostOldRecognitionDialog(newVal) {
      this.dialog = newVal
    },
    dialog(newVal) {
      this.$emit('onOpenCloseMissionLostOldRecognitionDialog', newVal)
    },
    // 在当前页面展示选择的相片
    selectPhoto(newVal) {
      if (newVal && newVal.length !== 0) {
        const fileReader = new FileReader()
        fileReader.readAsBinaryString(newVal)
        const that = this
        fileReader.onload = function (f) {
          // 此处的 this 为 fileReader
          const src =
            'data:' + newVal.type + ';base64,' + window.btoa(this.result)
          that.selectPhotoSrc = src
        }
      } else {
        this.selectPhotoSrc = ''
      }
    },
  },
  created() {
    this.dialog = this.missionLostOldRecognitionDialog
  },
  methods: {
    // TODO: 将选择的照片与老人的照片进行比对，返回结果赋值给 result
    recognize() {
      this.loading = true
      console.log(`识别走失老人`)
      const result = '98%'
      this.result = result
      this.snackbarText = `有 ${result} 的可能性为待寻找老人`
      this.snackbar = true
      this.loading = false
    },
    // 重置本页面
    reset() {
      this.selectPhoto = null
      this.selectPhotoSrc = ''
      this.result = ''
      this.snackbar = false
      this.snackbarText = ''
    },
  },
}
</script>

<style lang="scss" scoped></style>
