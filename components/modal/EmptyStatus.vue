<template>
  <div>
    <v-card elevation="0">
      <div>
        <v-icon x-large>{{ icon }}</v-icon>
      </div>
      <v-card-subtitle class="pt-2">{{ text }}</v-card-subtitle>
      <!-- 点击按钮触发父组件传入的 confirm 事件 -->
      <v-btn
        v-if="!hideButton"
        depressed
        :color="color"
        :dark="dark"
        @click="$emit('confirm')"
        >{{ buttonText }}</v-btn
      >
    </v-card>
  </div>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      required: false,
      default: '',
    },
    text: {
      type: String,
      required: true,
    },
    buttonText: {
      type: String,
      required: false,
      default: '确认',
    },
    hideButton: {
      type: Boolean,
      required: false,
      default: false,
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
  },
}
</script>
