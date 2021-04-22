<template>
  <!-- 确认操作对话框 -->
  <v-dialog
    v-model="dialog"
    max-width="600"
    :persistent="persistent || loading"
    @click:outside="persistent || loading ? '' : cancel()"
  >
    <v-card class="rounded-lg">
      <v-card-title>{{ title }}</v-card-title>
      <v-card-text v-if="!custom" class="confirm-dialog-content">{{
        text
      }}</v-card-text>
      <v-card-text v-if="custom" class="confirm-dialog-content"
        ><slot></slot
      ></v-card-text>
      <v-card-text
        v-if="confirmInput && !custom && !customButton && !customConfirmButton"
        class="pb-0 confirm-dialog-content"
      >
        <div class="pb-2">
          您需要在下方输入<span class="font-weight-bold">{{
            confirmInput
          }}</span
          >以继续操作。
        </div>
        <v-text-field
          v-model="input"
          :class="dark ? 'white--text' : ''"
          :color="color"
          outlined
          dense
          :disabled="loading"
        ></v-text-field>
      </v-card-text>
      <v-card-actions v-if="!customButton">
        <v-spacer />
        <v-btn
          v-if="!hideCancel"
          :disabled="loading"
          depressed
          @click="cancel()"
          >{{ cancelText }}</v-btn
        >
        <v-btn
          v-if="!customConfirmButton"
          class="ml-2"
          :class="dark ? 'white--text' : ''"
          depressed
          :color="color"
          :disabled="confirmInput !== input || confirmDisabled || loading"
          :loading="loading"
          @click="confirm()"
          >{{ confirmText }}</v-btn
        >
        <span v-if="customConfirmButton" class="ml-2">
          <slot name="confirmButton"></slot>
        </span>
      </v-card-actions>
      <v-card-actions v-if="customButton"
        ><slot name="button"></slot
      ></v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  model: {
    prop: 'confirmDialog',
    event: 'onOpenCloseDialog',
  },
  props: {
    confirmDialog: {
      type: Boolean,
      required: true,
      default: false,
    },
    // 设置点击对话框外边，对话框不消失
    persistent: {
      type: Boolean,
      required: false,
      default: false,
    },
    // 对话框标题
    title: {
      type: String,
      required: false,
      default: '确认操作',
    },
    // 设置主体内容自定义，将覆盖 text, confirmInput 项
    custom: {
      type: Boolean,
      required: false,
      default: false,
    },
    // 设置按钮内容自定义，将覆盖 customConfirmButton, cancelText, hideCancel, confirmText,
    // confirmDisabled, confirmAutoClose, confirmInput, @confirm, @cancel 等项
    customButton: {
      type: Boolean,
      required: false,
      default: false,
    },
    // 设置确认按钮内容自定义，将覆盖 confirmText, confirmDisabled, confirmAutoClose,
    // confirmInput, @confirm 项
    customConfirmButton: {
      type: Boolean,
      required: false,
      default: false,
    },
    // 主体内容
    text: {
      type: String,
      required: false,
      default: '您确定要进行此操作吗？',
    },
    // 取消按钮文本
    cancelText: {
      type: String,
      required: false,
      default: '取消',
    },
    // 隐藏取消按钮
    hideCancel: {
      type: Boolean,
      required: false,
      default: false,
    },
    // 确认按钮文本
    confirmText: {
      type: String,
      required: false,
      default: '确定',
    },
    // 禁用确认按钮
    confirmDisabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    // 点击确认按钮后自动关闭对话框
    // 禁用后需要在父级页面利用 v-model 手动关闭此对话框
    confirmAutoClose: {
      type: Boolean,
      required: false,
      default: true,
    },
    // 设置加载状态
    // 加载状态下无法关闭对话框
    loading: {
      type: Boolean,
      required: false,
      default: false,
    },
    // 对话框主要颜色
    color: {
      type: String,
      required: false,
      default: 'primary',
    },
    // 设置确认按钮文本颜色
    // 当值为 true 时文本为白色，否则为深色
    dark: {
      type: Boolean,
      required: false,
      default: true,
    },
    // 设置输入确认文字
    confirmInput: {
      type: String,
      required: false,
      default: '',
    },
  },
  data: () => ({
    dialog: false,
    input: '',
  }),
  watch: {
    // 监听打开和关闭确认对话框事件
    confirmDialog(newVal) {
      this.dialog = newVal

      // 打开时设置已输入内容为空
      if (newVal) {
        this.input = ''
      }
    },
    // 维护父组件的 v-model
    dialog(newVal) {
      this.$emit('onOpenCloseDialog', newVal)
    },
  },
  created() {
    this.dialog = this.confirmDialog
  },
  methods: {
    // 触发父组件传入的 cancel 事件
    cancel() {
      this.$emit('cancel')
      this.dialog = false
    },
    // 触发父组件传入的 confirm 事件
    confirm() {
      this.$emit('confirm')
      if (this.confirmAutoClose) this.dialog = false
    },
  },
}
</script>

<style lang="scss" scoped>
.confirm-dialog-content {
  font-size: 16px;
}
</style>
