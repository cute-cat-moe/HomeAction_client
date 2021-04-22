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
        <v-toolbar class="dialog-toolbar" dark :color="color" width="100%">
          <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title class="px-3">识别老人</v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <v-btn text :disabled="loading" @click="reset()">重置页面</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <div class="dialog-container">
          <v-container class="pa-4">
            <v-row no-gutters>
              <v-col cols="12" align-self="center">
                <v-card elevation="0">
                  <v-card-title class="pb-2"> 人脸识别结果 </v-card-title>
                  <v-card-text class="pb-0" style="font-size: 16px">{{
                    resultList.length !== 0
                      ? `当前进行人脸识别的照片有 ${resultList.length} 个可能性较高的比对结果`
                      : '您需要上传进行人脸识别的照片并执行识别操作；或现在暂无可能性较高的比对结果'
                  }}</v-card-text>

                  <v-card
                    v-for="(result, index) in resultList"
                    :key="index"
                    class="rounded-lg my-4"
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

                  <v-divider class="mx-2 my-4" />

                  <v-file-input
                    v-model="selectPhoto"
                    accept="image/*"
                    prepend-icon="mdi-camera"
                    filled
                    label="从相册上传照片进行人脸识别"
                    :color="color"
                    class="mx-4"
                  ></v-file-input>
                  <v-row>
                    <v-col v-if="selectPhotoSrc" cols="12">
                      <v-img class="rounded-lg" :src="selectPhotoSrc"></v-img>
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
              :color="color"
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

    <BottomSnackbar v-model="snackbar" :text="snackbarText" :color="color" />
  </div>
</template>

<script>
import BottomSnackbar from '~/components/modal/BottomSnackbar'

export default {
  components: { BottomSnackbar },
  model: {
    prop: 'lostOldRecognitionDialog',
    event: 'onOpenCloseLostOldRecognitionDialog',
  },
  props: {
    lostOldRecognitionDialog: {
      type: Boolean,
      required: true,
    },
    color: {
      type: String,
      required: false,
      default: 'primary',
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
    resultList: [],
    // 消息条
    snackbar: false,
    snackbarText: '',
  }),
  watch: {
    lostOldRecognitionDialog(newVal) {
      this.dialog = newVal
    },
    dialog(newVal) {
      this.$emit('onOpenCloseLostOldRecognitionDialog', newVal)
    },
    // 在当前页面展示选择的相片
    selectPhoto(newVal) {
      if (newVal && newVal.length !== 0) {
        const fileReader = new FileReader()
        fileReader.readAsBinaryString(newVal)
        const that = this
        fileReader.onload = function (f) {
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
    this.dialog = this.lostOldRecognitionDialog
  },
  methods: {
    // TODO: 将选择的照片与数据库尚未找到的走失老人的照片进行比对，返回结果赋值给 result
    recognize() {
      this.loading = true
      this.snackbar = false

      this.$nextTick(() => {
        console.log(`识别走失老人`)
        const resultList = [
          {
            result: '98%',
            photo: '/old-man.jpg',
          },
          {
            result: '98%',
            photo: '/old-woman.jpg',
          },
        ]
        this.resultList = resultList
        this.snackbarText = `上传的照片查询到 ${resultList.length} 个可能性较高的比对结果`
        this.snackbar = true
        this.loading = false
      })
    },
    // 重置本页面
    reset() {
      this.selectPhoto = null
      this.selectPhotoSrc = ''
      this.resultList = []
      this.snackbar = false
      this.snackbarText = ''
    },
  },
}
</script>

<style lang="scss" scoped></style>
