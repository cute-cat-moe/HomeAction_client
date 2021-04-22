<template>
  <!-- 浮动按钮模板 -->
  <v-fab-transition>
    <v-btn
      v-model="fab"
      fixed
      fab
      dark
      bottom
      right
      :color="filled ? color : 'white'"
      elevation="2"
      @click="$emit('click')"
    >
      <v-icon :color="filled ? 'white' : color">{{ icon }}</v-icon>
    </v-btn>
  </v-fab-transition>
</template>

<script>
export default {
  model: {
    prop: 'floatButton',
    event: 'onShowHideFloatButton',
  },
  props: {
    floatButton: {
      type: Boolean,
      required: false,
      default: true,
    },
    icon: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: false,
      default: 'primary',
    },
    // 填充按钮
    filled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data: () => ({
    fab: true,
  }),
  watch: {
    fab(newVal) {
      this.$emit('onShowHideFloatButton', newVal)
    },
    floatButton(newVal) {
      this.fab = newVal
    },
  },
  created() {
    this.fab = this.floatButton
  },
}
</script>
