<template>
  <!-- 回到页面顶端按钮 -->
  <v-fab-transition>
    <v-btn
      v-show="scrollVal > 300"
      fixed
      fab
      dark
      bottom
      right
      color="white"
      elevation="2"
      class="mb-12"
      @click="backToTop"
    >
      <v-icon :color="themeColor">mdi-arrow-up</v-icon>
    </v-btn>
  </v-fab-transition>
</template>

<script>
export default {
  props: {
    themeColor: {
      type: String,
      required: true,
      default: 'primary',
    },
  },
  data: () => ({
    scrollVal: 0,
  }),
  mounted() {
    // 每 300 毫秒获取当前的 scrollVal 值
    const throttleOnScroll = this.$Main.throttle(this, this.onScroll, 300)
    window.addEventListener('scroll', throttleOnScroll)
  },
  methods: {
    onScroll() {
      this.scrollVal = window.pageYOffset
    },
    backToTop() {
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth',
      })
    },
  },
}
</script>
