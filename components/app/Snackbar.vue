<template>
  <!-- 消息通知（可以自动关闭） -->
  <v-snackbar
    v-model="snackbar"
    app
    top
    light
    color="white"
    elevation="2"
    :timeout="timeout"
  >
    {{ text }}
    <template #action="{ attrs }">
      <v-btn
        v-show="!hideCloseButton"
        :color="themeColor"
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
  components: {},
  props: {
    themeColor: {
      type: String,
      required: true,
      default: 'primary',
    },
  },
  data: () => ({
    snackbar: false,
    text: '',
    timeout: 5000,
    hideCloseButton: false,
  }),
  mounted() {
    this.$Bus.$on('openSnackbar', (msg) => {
      this.text = msg.text || ''
      this.hideCloseButton = msg.hideCloseButton || false
      const timeout = msg.timeout || 5000
      this.refreshTimeout(timeout)

      this.snackbar = true
    })
  },
  methods: {
    refreshTimeout(timeout) {
      this.timeout = -1
      this.$nextTick(() => {
        this.timeout = timeout
      })
    },
  },
}
</script>
