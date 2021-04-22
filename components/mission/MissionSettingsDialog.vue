<template>
  <div>
    <!-- 任务设置对话框，只有指挥可以修改 -->
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
          <v-toolbar-title class="px-3">任务设置</v-toolbar-title>
        </v-toolbar>
        <div class="dialog-container">
          <v-container class="pa-4">
            <v-list flat two-line>
              <v-subheader>任务信息</v-subheader>
              <v-list-item
                :disabled="role !== 'leader'"
                @click="missionNeedDialog = true"
              >
                <v-list-item-avatar>
                  <v-icon>mdi-human-greeting-proximity</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>召集人数</v-list-item-title>
                  <v-list-item-subtitle>{{
                    role === 'leader'
                      ? '修改救援任务的召集人数'
                      : '当前救援任务召集人数'
                  }}</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>{{
                  missionDetail.need
                }}</v-list-item-action>
              </v-list-item>
              <v-list-item
                :disabled="role !== 'leader'"
                @click="missionLevelDialog = true"
              >
                <v-list-item-avatar>
                  <v-icon>mdi-android-auto</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>任务等级</v-list-item-title>
                  <v-list-item-subtitle>{{
                    role === 'leader'
                      ? '修改救援任务的优先等级'
                      : '当前救援任务优先等级'
                  }}</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>{{
                  $ValueHandler.getMissionLevelFromValue(missionDetail.level)
                }}</v-list-item-action>
              </v-list-item>

              <v-divider></v-divider>

              <v-subheader>任务操作</v-subheader>
              <v-list-item
                v-if="role === 'volunteer'"
                :disabled="role !== 'volunteer'"
                @click="missionLeaveDialog = true"
              >
                <v-list-item-avatar>
                  <v-icon>mdi-door-open</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>离开任务</v-list-item-title>
                  <v-list-item-subtitle
                    >因个人原因暂时离开任务</v-list-item-subtitle
                  >
                </v-list-item-content>
                <v-list-item-action></v-list-item-action>
              </v-list-item>
              <v-list-item
                v-if="role === 'leader'"
                :disabled="role !== 'leader'"
                @click="missionCloseDialog = true"
              >
                <v-list-item-avatar>
                  <v-icon>mdi-progress-check</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>关闭任务</v-list-item-title>
                  <v-list-item-subtitle
                    >已找到走失老人或任务结束</v-list-item-subtitle
                  >
                </v-list-item-content>
                <v-list-item-action></v-list-item-action>
              </v-list-item>
            </v-list>
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

    <!-- 修改任务召集人数对话框 -->
    <ConfirmDialog
      v-model="missionNeedDialog"
      :custom="true"
      title="修改任务召集人数"
      color="primaryMission"
      :confirm-disabled="missionNeedDialogConfirmDisabled"
      :confirm-auto-close="false"
      :loading="loading"
      @confirm="modifyMissionNeed(missionNeedDialogNeedNum)"
    >
      <div class="pb-2">
        当前任务的召集人数为
        <span class="font-weight-bold">{{ missionDetail.need }}</span> 人。
      </div>
      <v-form
        ref="missionNeedDialogForm"
        v-model="missionNeedDialogFormValid"
        lazy-validation
      >
        <v-text-field
          v-model="missionNeedDialogNeedNum"
          label="任务召集人数"
          type="number"
          :rules="[rules.required, rules.needNum]"
          :disabled="loading"
          color="primaryMission"
          clearable
          dense
          filled
        ></v-text-field>
      </v-form>
    </ConfirmDialog>

    <!-- 修改任务优先等级对话框 -->
    <ConfirmDialog
      v-model="missionLevelDialog"
      :custom="true"
      title="修改任务优先等级"
      color="primaryMission"
      :confirm-disabled="missionLevelDialogConfirmDisabled"
      :confirm-auto-close="false"
      :loading="loading"
      @confirm="modifyMissionLevel(missionLevelDialogSelectLevel)"
    >
      <div class="pb-2">
        当前任务的优先等级为
        <span class="font-weight-bold">{{
          $ValueHandler.getMissionLevelFromValue(missionDetail.level)
        }}</span
        >。
      </div>
      <v-form
        ref="missionLevelDialogForm"
        v-model="missionLevelDialogFormValid"
        lazy-validation
      >
        <v-select
          v-model="missionLevelDialogSelectLevel"
          :items="missionLevelDialogLevelItems"
          filled
          label="任务优先等级"
          :rules="[rules.required]"
          :disabled="loading"
          color="primaryMission"
          item-color="primaryMission"
          dense
        ></v-select>
      </v-form>
    </ConfirmDialog>

    <!-- 离开任务对话框 -->
    <ConfirmDialog
      v-model="missionLeaveDialog"
      :custom="true"
      title="离开任务"
      color="primaryMission"
      :confirm-auto-close="false"
      :loading="loading"
      @confirm="toConfirmLeaveMission()"
    >
      <div class="pb-2">您可以在下方输入您离开任务的原因。</div>
      <v-textarea
        v-model="missionLeaveReason"
        label="离开任务原因*"
        auto-grow
        filled
        rows="2"
        color="primaryMission"
      ></v-textarea>
    </ConfirmDialog>

    <!-- 确认离开任务对话框 -->
    <ConfirmDialog
      v-model="missionLeaveConfirmDialog"
      title="确定离开任务"
      text="您将离开任务，重新回到任务时仍将隶属于当前小队，确定要继续吗？"
      color="primaryMission"
      confirm-input="离开任务"
      @confirm="leaveMission()"
    />

    <!-- 关闭任务对话框 -->
    <ConfirmDialog
      v-model="missionCloseDialog"
      :custom="true"
      title="关闭任务"
      color="primaryMission"
      :confirm-disabled="missionCloseDialogConfirmDisabled"
      :confirm-auto-close="false"
      :loading="loading"
      @confirm="toConfirmCloseMission()"
    >
      <div class="pb-2">
        当前选择的任务结果为
        <span class="font-weight-bold">{{
          missionCloseDialogSelectResult || '未选择'
        }}</span
        >。
      </div>
      <v-form
        ref="missionCloseDialogForm"
        v-model="missionCloseDialogFormValid"
        lazy-validation
      >
        <v-select
          v-model="missionCloseDialogSelectResult"
          :items="missionCloseDialogResultItems"
          filled
          label="任务结果"
          :rules="[rules.required]"
          :disabled="loading"
          color="primaryMission"
          item-color="primaryMission"
          dense
        ></v-select>
      </v-form>
    </ConfirmDialog>

    <!-- 确认关闭任务对话框 -->
    <ConfirmDialog
      v-model="missionCloseConfirmDialog"
      title="确定关闭任务"
      :text="`将设置任务为${
        missionCloseDialogSelectResult === '找到走失老人'
          ? '完成状态'
          : '结束状态，暂时关闭任务'
      }，您确定要继续吗？`"
      color="primaryMission"
      confirm-input="关闭任务"
      @confirm="closeMission(missionCloseDialogSelectResult)"
    />
  </div>
</template>

<script>
import ConfirmDialog from '~/components/modal/ConfirmDialog'

export default {
  components: { ConfirmDialog },
  model: {
    prop: 'missionSettingsDialog',
    event: 'onOpenCloseMissionSettingsDialog',
  },
  props: {
    missionSettingsDialog: {
      type: Boolean,
      required: true,
    },
    missionDetail: {
      type: Object,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    dialog: false,
    // 修改任务设置时加载动画
    loading: false,
    // 任务召集人数对话框相关
    missionNeedDialog: false,
    missionNeedDialogFormValid: true,
    missionNeedDialogConfirmDisabled: true,
    missionNeedDialogNeedNum: '',
    // 任务优先等级对话框相关
    missionLevelDialog: false,
    missionLevelDialogFormValid: true,
    missionLevelDialogConfirmDisabled: true,
    missionLevelDialogLevelItems: ['一级', '二级', '三级'],
    missionLevelDialogSelectLevel: '',
    // 离开任务对话框相关
    missionLeaveDialog: false,
    missionLeaveReason: '',
    // 确认离开任务对话框
    missionLeaveConfirmDialog: false,
    // 关闭任务对话框相关
    missionCloseDialog: false,
    missionCloseDialogFormValid: true,
    missionCloseDialogConfirmDisabled: true,
    missionCloseDialogResultItems: ['找到走失老人', '未找到走失老人'],
    missionCloseDialogSelectResult: '',
    // 确认关闭任务对话框
    missionCloseConfirmDialog: false,
    // 表单验证规则
    rules: {
      required: (value) => !!value || '您必须填写该字段',
      needNum: (value) => value > 1 || '召集人数不能少于 1 人',
    },
  }),
  watch: {
    missionSettingsDialog(newVal) {
      this.dialog = newVal
    },
    dialog(newVal) {
      this.$emit('onOpenCloseMissionSettingsDialog', newVal)
    },
    // 监听召集人数设置变化
    missionNeedDialogNeedNum(newVal) {
      // 值为 string 或 number 类型，故使用 != 不验证类型
      if (newVal && newVal != this.missionDetail.need) {
        // 设置按钮可点击
        this.missionNeedDialogConfirmDisabled = false
      } else {
        this.missionNeedDialogConfirmDisabled = true
      }
    },
    // 监听任务优先等级下拉框选项变化
    missionLevelDialogSelectLevel(newVal) {
      if (
        newVal &&
        newVal !==
          this.$ValueHandler.getMissionLevelFromValue(this.missionDetail.level)
      ) {
        this.missionLevelDialogConfirmDisabled = false
      } else {
        this.missionLevelDialogConfirmDisabled = true
      }
    },
    // 监听关闭任务下拉框选项变化
    missionCloseDialogSelectResult(newVal) {
      this.missionCloseDialogConfirmDisabled = !newVal
    },
  },
  created() {
    this.dialog = this.missionSettingsDialog
    this.missionNeedDialogNeedNum = this.missionDetail.need
    this.missionLevelDialogSelectLevel = this.$ValueHandler.getMissionLevelFromValue(
      this.missionDetail.level
    )
  },
  methods: {
    // TODO: 修改任务召集人数
    modifyMissionNeed(needNum) {
      if (this.$refs.missionNeedDialogForm.validate()) {
        // 表单合法
        // 设置加载状态
        this.loading = true

        console.log('修改成功！')

        // 修改 Mission 组件中的 mission 对象
        const missionDetail = this.missionDetail
        missionDetail.need = needNum
        this.$Bus.$emit('modifyMissionInfo', {
          missionDetail,
        })

        // 设置加载状态结束
        this.loading = false
        // 手动关闭对话框
        this.missionNeedDialog = false
      } else {
        this.missionNeedDialogConfirmDisabled = true
      }
    },
    // TODO: 修改任务优先等级
    modifyMissionLevel(level) {
      if (this.$refs.missionLevelDialogForm.validate()) {
        this.loading = true

        console.log('修改成功！')

        // 根据 level 的文本值获取数值并维护 mission 对象
        const missionDetail = this.missionDetail
        missionDetail.level = this.$ValueHandler.getValueFromMissionLevel(level)
        this.$Bus.$emit('modifyMissionInfo', {
          missionDetail,
        })

        this.loading = false
        this.missionLevelDialog = false
      } else {
        this.missionLevelDialogConfirmDisabled = true
      }
    },
    // 打开确认离开任务对话框
    toConfirmLeaveMission() {
      this.missionLeaveConfirmDialog = true
    },
    // TODO: 离开任务
    leaveMission() {
      this.loading = true
      const leaveReason = this.missionLeaveReason

      this.loading = false
      this.missionLeaveDialog = false
    },
    // 打开确认关闭任务对话框
    toConfirmCloseMission() {
      if (this.$refs.missionCloseDialogForm.validate()) {
        this.missionCloseConfirmDialog = true
      } else {
        this.missionCloseDialogConfirmDisabled = true
      }
    },
    // TODO: 关闭任务（完成任务或结束任务）
    closeMission(statusText) {
      this.loading = true

      // 任务完成对应任务状态值为 3，任务结束对应状态值为 4
      const status = statusText === '找到走失老人' ? 3 : 4

      console.log('修改成功！')

      // 维护 mission 对象
      const missionDetail = this.missionDetail
      missionDetail.status = status
      this.$Bus.$emit('modifyMissionInfo', {
        missionDetail,
      })

      this.loading = false
      this.missionCloseDialog = false
    },
  },
}
</script>
