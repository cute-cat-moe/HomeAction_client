<template>
  <div />
</template>

<script>
export default {
  components: {},
  created() {
    // TODO: 校验用户登录状态
    // 如果没有登录切换到 /login 路由
    // 如果已登录切换到对应的路由
    this.$router.replace({
      path: '/login',
    })
  },
}
</script>
