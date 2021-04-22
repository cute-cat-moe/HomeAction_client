<template>
  <!-- 状态信息（需要手动关闭） -->
  <v-alert
    :value="alert"
    :color="color"
    dense
    border="left"
    colored-border
    transition="scroll-x-transition"
    elevation="2"
    class="mt-2 mx-1"
  >
    <v-row align="center">
      <v-col class="grow">
        {{ alertText }}
      </v-col>
      <v-col class="shrink">
        <v-btn :color="color" depressed @click="takeAction">{{
          actionText
        }}</v-btn>
      </v-col>
    </v-row>
  </v-alert>
</template>

<script>
export default {
  model: {
    prop: 'status',
    event: 'onShowHideStatus',
  },
  props: {
    status: {
      type: Boolean,
      required: true,
      default: false,
    },
    alertText: {
      type: String,
      required: true,
      default: '',
    },
    actionText: {
      type: String,
      required: false,
      default: '确定',
    },
    color: {
      type: String,
      required: false,
      default: 'accent',
    },
    icon: {
      type: String,
      required: false,
      default: '',
    },
    showAlert: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data: () => ({
    alert: false,
  }),
  watch: {
    status(newVal) {
      this.alert = newVal
    },
    alert(newVal) {
      this.$emit('onShowHideStatus', newVal)
    },
  },
  created() {
    this.alert = this.status
  },
  methods: {
    takeAction() {
      this.$emit('action')
      this.alert = false
    },
  },
}
</script>
