<template>
  <!-- 编辑（创建，修改和完善）走失老人信息表单 -->
  <div>
    <v-dialog
      v-model="MissionLostOldDetailEditorDialog"
      fullscreen
      hide-overlay
      persistent
      no-click-animation
      transition="dialog-bottom-transition"
    >
      <v-card color="#f2f2f2">
        <v-toolbar
          dark
          color="relativeColor"
          class="dialog-toolbar"
          width="100%"
        >
          <v-btn icon dark @click="closeConfirmDialog = true">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title class="px-3">{{ dialogTitle }}</v-toolbar-title>
          <v-spacer />
          <v-btn icon dark @click="validateLostOldDetailForm()">
            <v-icon>mdi-check</v-icon>
          </v-btn>
        </v-toolbar>
        <div class="dialog-container px-3">
          <v-form ref="form" v-model="formValid" lazy-validation>
            <div class="pl-4">注：带有 * 表示非必需字段</div>

            <!-- 家属联系方式内容，家属和领队可以修改 -->
            <ContentTitle>
              家属联系方式
              <!-- <template #action>
                <v-btn depressed @click="addRelative()">添加联系方式</v-btn>
              </template> -->
            </ContentTitle>
            <v-card
              outlined
              class="rounded-lg"
              :color="editCardColor"
              :elevation="editCardElevation"
            >
              <v-card-text class="pt-6">
                <!-- <div
                  v-for="(relative, index) in lostOldDetail.relative"
                  :key="relative.id"
                > -->
                <v-row no-gutters>
                  <v-col cols="4" class="pr-2">
                    <!-- 家属姓名 -->
                    <v-text-field
                      v-model="lostOldDetail.relative.name"
                      :rules="relativeNameRules"
                      label="家属姓名"
                      filled
                      :background-color="editColor"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="8" class="pl-1">
                    <!-- 家属联系电话 -->
                    <v-text-field
                      v-model="lostOldDetail.relative.telephone"
                      :rules="relativeTelephoneRules"
                      counter="11"
                      filled
                      :background-color="editColor"
                      label="家属联系电话"
                    >
                    </v-text-field>
                  </v-col>
                </v-row>
                <!-- </div> -->
              </v-card-text>
            </v-card>

            <!-- 老人基本信息内容，仅家属可以填写和修改 -->
            <ContentTitle>老人基本信息</ContentTitle>
            <v-card
              outlined
              class="rounded-lg"
              :color="editCardColor"
              :elevation="editCardElevation"
            >
              <v-card-text class="pt-6">
                <v-row no-gutters>
                  <v-col cols="12">
                    <!--
                      对此照片进行人脸识别提取关键特征点，
                      将作为志愿者识别老人的依赖

                      仅在创建救援请求时可以修改此项
                    -->
                    <v-file-input
                      v-model="lostOldDetail.mainPhoto"
                      :background-color="editColor"
                      accept="image/*"
                      :rules="mode === 'create' ? mainPhotoRules : noRules"
                      :hint="
                        mode === 'create'
                          ? '该照片十分重要，将使用此照片对疑似老人进行人脸识别对比，判断是否为走失老人'
                          : '您无法修改此照片'
                      "
                      label="老人近期正脸照片"
                      persistent-hint
                      prepend-icon="mdi-face-recognition"
                      filled
                      show-size
                      :disabled="mode !== 'create'"
                    ></v-file-input>
                  </v-col>
                  <v-col cols="12">
                    <!--
                      补充的老人照片

                      修改此项将会删除覆盖之前上传的照片
                    -->
                    <v-file-input
                      v-model="lostOldDetail.additionalPhoto"
                      :background-color="editColor"
                      accept="image/*"
                      :hint="
                        mode === 'create'
                          ? '走失老人的近期照片，将帮助志愿者更好地识别老人'
                          : mode === 'modify'
                          ? '您无法重新选择补充的老人照片'
                          : lostOldDetail.additionalPhoto === undefined ||
                            lostOldDetail.additionalPhoto.length === 0
                          ? '重新选择照片会删除并覆盖以前上传的照片'
                          : '您可以清除选择以避免覆盖以前上传的照片'
                      "
                      :label="
                        mode === 'create'
                          ? '老人近期照片*'
                          : '重新选择老人近期照片'
                      "
                      persistent-hint
                      prepend-icon="mdi-camera"
                      filled
                      multiple
                      show-size
                      :disabled="mode === 'modify'"
                    ></v-file-input>
                  </v-col>
                  <v-col cols="4" class="pr-2">
                    <!-- 老人的姓名 -->
                    <v-text-field
                      v-model="lostOldDetail.name"
                      :background-color="editColor"
                      :rules="nameRules"
                      label="老人姓名"
                      filled
                      :disabled="mode === 'modify'"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="4" class="px-1">
                    <!-- 老人的性别 -->
                    <v-select
                      v-model="lostOldDetail.gender"
                      :background-color="editColor"
                      :rules="genderRules"
                      :items="['男', '女']"
                      label="老人性别"
                      filled
                      :disabled="mode === 'modify'"
                    ></v-select>
                  </v-col>
                  <v-col cols="4" class="pl-2">
                    <!-- 老人的年龄 -->
                    <v-text-field
                      v-model="lostOldDetail.age"
                      :background-color="editColor"
                      :rules="ageRules"
                      label="老人年龄"
                      filled
                      :disabled="mode === 'modify'"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <!-- 老人走失信息内容，仅家属可以填写和修改 -->
            <ContentTitle>老人走失信息</ContentTitle>
            <v-card
              outlined
              class="rounded-lg"
              :color="editCardColor"
              :elevation="editCardElevation"
            >
              <v-card-text class="pt-6">
                <v-row no-gutters>
                  <v-col cols="12">
                    <!-- 老人走失的地点 -->
                    <v-text-field
                      :background-color="editColor"
                      :value="lostOldDetail.lastKnownLocation.name"
                      :rules="lastKnownLocationRules"
                      prepend-icon="mdi-map-marker"
                      label="老人走失地点"
                      :hint="
                        mode === 'modify'
                          ? '您无法修改老人走失地点'
                          : '标注最后已知老人的地点，我们将围绕此地点展开搜救行动'
                      "
                      persistent-hint
                      filled
                      :disabled="mode === 'modify'"
                      @click="selectLastKnownLocation()"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <!-- 最后目击老人的时间 -->
                    <!-- eslint-disable vue/valid-v-model -->
                    <v-text-field
                      v-model="
                        lostOldDetail.lostDate + ' ' + lostOldDetail.lostTime
                      "
                      :background-color="editColor"
                      :rules="lostDateTimeRules"
                      prepend-icon="mdi-clock-time-four"
                      label="最后目击时间"
                      :hint="
                        mode === 'modify'
                          ? '您无法修改最后目击时间'
                          : '选择最后目击走失老人的时间，我们将指定更合理的搜救计划'
                      "
                      persistent-hint
                      :value="
                        lostOldDetail.lostDate + ' ' + lostOldDetail.lostTime
                      "
                      readonly
                      filled
                      :disabled="mode === 'modify'"
                      @click:prepend="dateTimePickerDialog = true"
                      @click="dateTimePickerDialog = true"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <!-- 老人常去的地点 -->
                    <v-select
                      :value="lostOldDetail.starLocation"
                      :background-color="editColor"
                      :items="lostOldDetail.starLocation"
                      item-text="name"
                      item-value="lnglat"
                      return-object
                      prepend-icon="mdi-map-marker-star"
                      append-outer-icon="mdi-plus"
                      label="老人常活动地点*"
                      :hint="
                        mode === 'modify'
                          ? '您无法修改老人常活动地点'
                          : '标注老人常活动的地点，我们将重点关注这些地点'
                      "
                      persistent-hint
                      filled
                      multiple
                      chips
                      :disabled="mode === 'modify'"
                      @click:append-outer="selectStarLocation()"
                    ></v-select>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <!-- 老人补充信息内容，可选，家属和领队可以修改 -->
            <div v-if="mode !== 'create'">
              <ContentTitle>老人补充信息</ContentTitle>
              <v-card
                outlined
                class="rounded-lg"
                :color="editCardColor"
                :elevation="editCardElevation"
              >
                <v-card-text class="pt-6">
                  <v-row no-gutters>
                    <v-col cols="12">
                      <!-- 老人的籍贯 -->
                      <v-text-field
                        v-model="lostOldDetail.nativePlace"
                        :background-color="editColor"
                        label="老人籍贯*"
                        filled
                        light
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <!-- 老人的疾病史 -->
                      <v-textarea
                        v-model="lostOldDetail.diseaseHistory"
                        :background-color="editColor"
                        label="老人疾病史*"
                        filled
                        rows="2"
                        auto-grow
                      ></v-textarea>
                    </v-col>
                    <v-col cols="12">
                      <!-- 老人的体态特征 -->
                      <v-textarea
                        v-model="lostOldDetail.posture"
                        :background-color="editColor"
                        label="老人体态特征*"
                        filled
                        rows="2"
                        auto-grow
                      ></v-textarea>
                    </v-col>
                    <v-col cols="12">
                      <!-- 老人的衣着特征 -->
                      <v-textarea
                        v-model="lostOldDetail.clothing"
                        :background-color="editColor"
                        label="老人衣着特征*"
                        filled
                        rows="2"
                        auto-grow
                      ></v-textarea>
                    </v-col>
                    <v-col cols="12">
                      <!-- 老人的其他特征 -->
                      <v-textarea
                        v-model="lostOldDetail.otherChara"
                        :background-color="editColor"
                        label="老人其他特征*"
                        filled
                        rows="2"
                        auto-grow
                      ></v-textarea>
                    </v-col>
                    <v-col cols="12">
                      <!-- 补充关于老人的其他信息 -->
                      <v-textarea
                        v-model="lostOldDetail.otherInfo"
                        :background-color="editColor"
                        label="补充其他信息*"
                        filled
                        rows="2"
                        auto-grow
                      ></v-textarea>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </div>
          </v-form>
        </div>
      </v-card>
    </v-dialog>

    <!-- 底部提示条 -->
    <BottomSnackbar v-model="bottomSnackbar" :text="bottomSnackbarText" />

    <!-- 老人走失地点选择器 -->
    <AddressPicker
      v-model="lastKnownLocationPicker"
      :select-address="lostOldDetail.lastKnownLocation"
    />

    <!-- 老人常去地点选择器 -->
    <AddressPicker
      v-model="starLocationPicker"
      multiple
      :select-address-array="lostOldDetail.starLocation"
    />

    <!-- 关闭页面对话框 -->
    <ConfirmDialog
      v-model="closeConfirmDialog"
      color="relativeColor"
      text="已修改的内容将不会保存，确定退出吗？"
      @confirm="MissionLostOldDetailEditorDialog = false"
    />

    <!-- 创建任务 / 保存修改对话框 -->
    <ConfirmDialog
      v-model="editConfirmDialog"
      color="relativeColor"
      :text="confirmDialogText"
      @confirm="saveLostOldDetail()"
    />

    <!-- 日期时间选择器 -->
    <DateTimePicker
      v-model="dateTimePickerDialog"
      :date="lostOldDetail.lostDate"
      :time="lostOldDetail.lostTime"
      @setDateTime="setDateTime"
    />
  </div>
</template>

<script>
import BottomSnackbar from '~/components/modal/BottomSnackbar'
import ContentTitle from '~/components/modal/ContentTitle'
import ConfirmDialog from '~/components/modal/ConfirmDialog'
import DateTimePicker from '~/components/modal/DateTimePicker'
import AddressPicker from '~/components/modal/MapSelectAddressDialog'

export default {
  components: {
    BottomSnackbar,
    ContentTitle,
    ConfirmDialog,
    DateTimePicker,
    AddressPicker,
  },
  data: () => ({
    editCardElevation: 1,
    editColor: 'rgba(255,255,255,0.72)',
    // editColor: '',
    editCardColor: 'rgba(255,233,207,0.65)',
    // editCardColor: '#ffffff',
    MissionLostOldDetailEditorDialog: false,
    // mode 为老人信息的修改（或创建）模式
    // 'create' 为家属创建模式，
    // 'modify' 为志愿者领队修改模式
    // 'complete' 为家属修改完善模式
    mode: 'create',
    formValid: false,
    lostOldId: '',
    // 任务中老人的具体信息
    lostOldDetail: {
      // 家属信息和联系方式
      relative: {
        id: '',
        name: '',
        telephone: '',
      },
      // 老人的正脸照片，用于人脸识别
      mainPhoto: undefined,
      // 老人的更多照片
      additionalPhoto: undefined,
      // 老人的姓名
      name: '',
      // 老人的性别
      gender: '',
      // 老人的年龄
      age: '',
      // 老人的走失地点，或最后已知地点
      lastKnownLocation: {},
      // 老人的常去地点
      starLocation: [],
      // 老人走失的日期
      lostDate: '',
      // 老人走失的时间
      lostTime: '',
      // 老人的籍贯
      nativePlace: '',
      // 老人的疾病史
      diseaseHistory: '',
      // 老人的体态特征
      posture: '',
      // 老人的衣着特征
      clothing: '',
      // 老人的其它特征
      otherChara: '',
      // 老人的补充信息
      otherInfo: '',
    },

    noRules: [true],
    relativeNameRules: [(v) => !!v || '您需要填写家属姓名'],
    relativeTelephoneRules: [
      (v) => !!v || '您需要填写家属联系电话',
      (v) => (v && v.length <= 11) || '您需要输入正确的联系电话',
    ],
    mainPhotoRules: [
      (v) => v !== undefined || '您需要选择走失老人的近期正脸照片',
    ],
    nameRules: [(v) => !!v || '您需要填写走失老人的姓名'],
    genderRules: [(v) => !!v || '您需要选择走失老人的性别'],
    ageRules: [(v) => !!v || '您需要选择走失老人的年龄'],
    lastKnownLocationRules: [(v) => !!v || '您需要选择老人走失的地点'],
    lostDateTimeRules: [
      (v) => {
        const lostDateTimeArr = v.split(' ')
        if (lostDateTimeArr[0].length === 0) {
          return '您需要选择老人走失的日期'
        } else if (lostDateTimeArr[1].length === 0) {
          return '您需要选择老人走失的具体时间'
        } else {
          return true
        }
      },
    ],
    bottomSnackbar: false,
    bottomSnackbarText: '',
    closeConfirmDialog: false,
    editConfirmDialog: false,
    // 老人走失时间选择器
    dateTimePickerDialog: false,
    // 老人走失地点选择器
    lastKnownLocationPicker: false,
    // 老人常去地点选择器
    starLocationPicker: false,
  }),
  computed: {
    dialogTitle() {
      switch (this.mode) {
        case 'create':
          return '填报走失老人信息'
        case 'modify':
          return '修改走失老人信息'
        case 'complete':
          return '完善走失老人信息'
        default:
          return '走失老人信息'
      }
    },
    confirmDialogText() {
      switch (this.mode) {
        case 'create':
          return '创建走失老人任务，我们将尽快为您审核并召集志愿者！'
        case 'modify':
          return '您确定要修改任务信息吗？'
        case 'complete':
          return '点击确定以完善任务信息'
        default:
          return '退出此页面？'
      }
    },
  },
  watch: {},
  mounted() {
    // 需要提供 mode 字段
    // complete 模式需提供 lostOldId 字段
    this.$Bus.$on('editLostOldDetail', (msg) => {
      console.log(msg)
      this.mode = msg.mode
      switch (msg.mode) {
        // 家属创建救援请求模式
        case 'create':
          this.resetLostOldDetail()
          break
        // 家属修改救援请求模式
        case 'modify':
          this.queryLostOldDetail()
          break
        // 家属完善救援请求模式
        case 'complete':
          this.queryLostOldDetail()
          break
        default:
          throw new Error(
            '~/components/app/LostOldDetailEditorDialog.vue: 需要为 $Bus.$emit.("editLostOldDetail", msg) 方法提供正确的编辑模式'
          )
      }
      this.MissionLostOldDetailEditorDialog = true
      // this.$nextTick(() => {
      //   this.$refs.form.resetValidation()
      // })
    })
  },
  methods: {
    // 初始化老人信息
    // 适用于家属创建（create）救援请求模式
    resetLostOldDetail() {
      this.lostOldId = ''
      this.lostOldDetail = {
        relative: {
          id: '',
          name: '',
          telephone: '',
        },
        mainPhoto: undefined,
        additionalPhoto: undefined,
        name: '',
        gender: '',
        age: '',
        lastKnownLocation: {
          name: '',
          lnglat: [],
        },
        starLocation: [],
        lostDate: '',
        lostTime: '',
        nativePlace: '',
        diseaseHistory: '',
        posture: '',
        clothing: '',
        otherChara: '',
        otherInfo: '',
      }
    },
    // TODO: 获取老人的信息
    // 适用于领队修改（modify）老人信息模式或家属完善（complete）救援请求模式
    // 通过 lostOldId 从后端读取任务中老人的信息
    // 不应获取 mainPhoto 和 additionalPhoto 内容，设置为 undefined 即可
    queryLostOldDetail() {
      // 获取老人详细信息

      this.lostOldDetail.relative.id = this.$store.state.relative.missionInfo.lostOldDetail.relative.id
      this.lostOldDetail.relative.name = this.$store.state.relative.missionInfo.lostOldDetail.relative.name
      this.lostOldDetail.relative.telephone = this.$store.state.relative.missionInfo.lostOldDetail.relative.telephone

      this.lostOldDetail.name = this.$store.state.relative.missionInfo.lostOldDetail.name
      this.lostOldDetail.gender = this.$store.state.relative.missionInfo.lostOldDetail.gender
      this.lostOldDetail.age = this.$store.state.relative.missionInfo.lostOldDetail.age

      this.lostOldDetail.lastKnownLocation.name = this.$store.state.relative.missionInfo.lostOldDetail.lastKnownLocation.name
      this.lostOldDetail.lastKnownLocation.lnglat = this.$store.state.relative.missionInfo.lostOldDetail.lastKnownLocation.lnglat

      this.lostOldDetail.starLocation = this.$store.state.relative.missionInfo.lostOldDetail.starLocation
      this.lostOldDetail.lostDate = this.$store.state.relative.missionInfo.lostOldDetail.lostDate
      this.lostOldDetail.lostTime = this.$store.state.relative.missionInfo.lostOldDetail.lostTime
      this.lostOldDetail.nativePlace = this.$store.state.relative.missionInfo.lostOldDetail.nativePlace
      this.lostOldDetail.diseaseHistory = this.$store.state.relative.missionInfo.lostOldDetail.diseaseHistory
      this.lostOldDetail.posture = this.$store.state.relative.missionInfo.lostOldDetail.posture
      this.lostOldDetail.clothing = this.$store.state.relative.missionInfo.lostOldDetail.clothing
      this.lostOldDetail.otherChara = this.$store.state.relative.missionInfo.lostOldDetail.otherChara
      this.lostOldDetail.otherInfo = this.$store.state.relative.missionInfo.lostOldDetail.otherInfo
      // console.log(lostOldId)
      // this.lostOldId = lostOldId
      // this.lostOldDetail = {
      //   relative: {
      //     id: new Date().getTime(),
      //     name: '吴先生',
      //     telephone: '18980340000',
      //   },
      //   mainPhoto: undefined,
      //   additionalPhoto: undefined,
      //   name: 'zzz',
      //   gender: '男',
      //   age: '67',
      //   lastKnownLocation: {
      //     name: '成都市成华区电子科技大学欣苑学生公寓',
      //     lnglat: ['234', '236'],
      //   },
      //   starLocation: [
      //     {
      //       name: '电子科技大学清水河校区',
      //       lnglat: ['123', '15346'],
      //     },
      //     {
      //       name: '九眼桥',
      //       lnglat: ['315', '1325234'],
      //     },
      //   ],
      //   lostDate: '2021-04-04',
      //   lostTime: '23:13',
      //   nativePlace: '江西省',
      //   diseaseHistory: '心脏病',
      //   posture: '肥宅',
      //   clothing: '一身脏衣服',
      //   otherChara: '戴眼镜',
      //   otherInfo: '经常去酒吧',
      // }
    },
    // TODO: 选择老人走失地点
    selectLastKnownLocation() {
      this.lastKnownLocationPicker = true
    },
    // TODO: 添加老人常去地点
    selectStarLocation() {
      this.starLocationPicker = true
      this.lostOldDetail.starLocation.push({
        name: '常去地点' + new Date().getTime(),
        lnglat: [new Date().getTime(), new Date().getTime()],
      })
    },
    // 关闭 DateTimePicker 组件
    cancelSetDateTime() {
      this.dateTimePickerDialog = false
    },
    // 从 DateTimePicker 组件获取选择的日期和时间
    setDateTime(val) {
      this.lostOldDetail.lostDate = val.date
      this.lostOldDetail.lostTime = val.time
      this.dateTimePickerDialog = false
    },
    // 校验表单
    validateLostOldDetailForm() {
      // 成功将打开保存信息确认对话框
      if (this.$refs.form.validate()) {
        this.editConfirmDialog = true
      } else {
        this.bottomSnackbarText = '提交失败，请确认表单信息填写正确'
        this.bottomSnackbar = true
      }
    },
    // TODO: 保存修改信息并退出
    // 1: 家属创建（create）救援请求模式
    // 家属可以填写所有内容，其中
    // relative 必须填写有一项，mainPhoto 不可为空
    // name，gender，lastKnownLocation，lostDate，lostTime 不可为空
    // 2: 领队修改（modify）老人信息模式
    // 领队只能对 relative，nativePlace，diseaseHistory，posture
    // 以及 clothing，otherChara，otherInfo 七项内容进行修改
    // 因此传值的时候只传这些内容即可
    // 3: 家属完善（complete）救援请求模式
    // 家属除了 mainPhoto 项都可以修改完善
    // 当 additionalPhoto 为空时表示不修改老人补充照片，不为空时用新的照片覆盖原有照片
    // 传值时应忽略 mainPhoto 项；当 additionalPhoto 不为空时才传入 additionalPhoto
    saveLostOldDetail() {
      switch (this.mode) {
        // 家属创建救援请求模式
        case 'create':
          this.createUpload()
          break
        // 指挥修改救援请求模式
        case 'modify':
          this.modifyUpload()
          break
        // 家属完善救援请求模式
        case 'complete':
          this.completeUpload()
          break
        default:
          throw new Error(
            '~/components/app/LostOldDetailEditorDialog.vue: 需要为 $Bus.$emit.("editLostOldDetail", msg) 方法提供正确的编辑模式'
          )
      }
      this.MissionLostOldDetailEditorDialog = false
    },
    // 添加亲属联系方式表单
    // addRelative() {
    //   this.lostOldDetail.relative.push({
    //     id: new Date().getTime(),
    //     name: '',
    //     telephone: '',
    //   })
    // },
    // 移除选中的亲属联系方式表单
    // removeRelative(id) {
    //   const relative = this.lostOldDetail.relative
    //   this.lostOldDetail.relative.splice(
    //     relative.findIndex((e) => e.id === id),
    //     1
    //   )
    // },
    // 向服务器上传家属创建（create）的信息
    createUpload() {
      if (this.$refs.form.validate()) {
        const formData = new window.FormData()
        // 家属id
        formData.append('rid', this.$store.state.relative.rid)
        // 家属姓名
        formData.append('r_name', this.lostOldDetail.relative.name)
        // 家属电话
        formData.append('r_phone', this.lostOldDetail.relative.telephone)
        // 老人正脸照片
        formData.append('photo', this.lostOldDetail.mainPhoto)
        // 老人近期照片数
        if (this.lostOldDetail.additionalPhoto === undefined) {
          formData.append('additionalPhotoNum', '0')
        } else {
          formData.append(
            'additionalPhotoNum',
            this.lostOldDetail.additionalPhoto.length
          )
          // 老人近期照片
          for (const item of this.lostOldDetail.additionalPhoto) {
            formData.append('additionalPhoto', item)
          }
        }
        // 老人姓名
        formData.append('name', this.lostOldDetail.name)
        // 老人性别
        formData.append('sex', this.lostOldDetail.gender)
        // 老人年龄
        formData.append('age', this.lostOldDetail.age)
        // 老人走失地点的文字信息
        formData.append('lost_area', this.lostOldDetail.lastKnownLocation.name)
        // 老人走失时间
        let time =
          this.lostOldDetail.lostDate +
          ' ' +
          this.lostOldDetail.lostTime +
          ':00'
        time = time.replace(/-/g, '/') // 把所有-转化成/
        const timestamp = new Date(time).getTime()
        formData.append('lost_time', timestamp.toString())
        // 老人常活动地点
        formData.append('star_location', this.lostOldDetail.starLocation)
        const config = {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        } // 添加请求头
        this.$axios
          .post('/api/relation/upload/test', formData, config)
          .then((Response) => {
            if (Response.data.meta.success) {
              // 提交成功
              this.$store.commit('relative/updateUpload', Response.data.data)
              // 显示上传成功并切换路由到当前任务界面
              this.$Bus.$emit('openSnackbar', {
                text: `上传成功`,
              })
              this.$Bus.$emit('setRelativeRouter', {
                routerIndex: 1,
                missionID: this.$store.state.relative.missionID,
              })
            } else {
              this.$Bus.$emit('openSnackbar', {
                text: `上传失败`,
              })
            }
          })
      }
    },
    // 向服务器上传家属修改（modify）的信息
    modifyUpload() {},
    // 向服务器上传家属完善（complete）的信息
    completeUpload() {},
  },
}
</script>
