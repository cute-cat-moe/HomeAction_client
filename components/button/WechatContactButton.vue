<template>
  <!-- 使用微信联系按钮 -->
  <v-btn
    v-show="wechat"
    depressed
    color="#04BE02"
    dark
    @click="wechatContact(wechat)"
    ><v-icon v-if="icon" left>{{ icon }}</v-icon
    >{{ text }}</v-btn
  >
</template>

<script>
export default {
  props: {
    wechat: {
      type: String,
      required: false,
      default: '',
    },
    text: {
      type: String,
      required: false,
      default: '微信联系',
    },
    icon: {
      type: String,
      required: false,
      default: 'mdi-wechat',
    },
  },
  methods: {
    wechatContact(wechat) {
      // TODO: 使用微信联系
      console.log(wechat)
    },
  },
}
</script>
