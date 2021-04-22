<template>
  <!-- 底部消息通知（可以自动关闭） -->
  <v-snackbar
    v-model="snackbar"
    bottom
    light
    color="white"
    elevation="2"
    :timeout="timeout"
  >
    {{ text }}
    <template #action="{ attrs }">
      <v-btn
        v-show="!hideCloseButton"
        :color="color"
        :dark="dark"
        text
        v-bind="attrs"
        @click="snackbar = false"
        >关闭</v-btn
      >
    </template>
  </v-snackbar>
</template>

<script>
export default {
  model: {
    prop: 'bottomSnackbar',
    event: 'onShowHideBottomSnackbar',
  },
  props: {
    bottomSnackbar: {
      type: Boolean,
      required: true,
      default: false,
    },
    text: {
      type: String,
      required: true,
      default: '',
    },
    color: {
      type: String,
      required: false,
      default: 'primary',
    },
    dark: {
      type: Boolean,
      required: false,
      default: true,
    },
    hideCloseButton: {
      type: Boolean,
      required: false,
      default: false,
    },
    timeout: {
      type: Number,
      required: false,
      default: 5000,
    },
  },
  data: () => ({
    snackbar: false,
    snackbarTimeout: 5000,
  }),
  watch: {
    bottomSnackbar(newVal) {
      if (newVal === true) {
        this.refreshTimeout()
        this.snackbar = true
      } else {
        this.snackbar = false
      }
    },
    snackbar(newVal) {
      this.$emit('onShowHideBottomSnackbar', newVal)
    },
  },
  created() {
    this.snackbar = this.bottomSnackbar
    this.snackbarTimeout = this.timeout
  },
  methods: {
    refreshTimeout() {
      this.snackbarTimeout = -1
      this.$nextTick(() => {
        this.snackbarTimeout = this.timeout || 5000
      })
    },
  },
}
</script>
