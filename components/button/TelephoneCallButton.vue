<template>
  <!-- 使用电话联系按钮 -->
  <v-btn
    v-show="telephone"
    depressed
    color="blue"
    dark
    @click="telephoneCall(telephone)"
    ><v-icon v-if="icon" left>{{ icon }}</v-icon
    >{{ text }}</v-btn
  >
</template>

<script>
export default {
  props: {
    telephone: {
      type: String,
      required: false,
      default: '',
    },
    text: {
      type: String,
      required: false,
      default: '电话联系',
    },
    icon: {
      type: String,
      required: false,
      default: 'mdi-phone',
    },
  },
  methods: {
    telephoneCall(telephone) {
      window.location.href = `tel://${telephone}`
    },
  },
}
</script>
