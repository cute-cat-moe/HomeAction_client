<template>
  <v-app>
    <v-card class="rounded-lg ma-auto" outlined elevation="1" max-width="600px">
      <v-card-title class="ma-4">
        <v-spacer />
        <div v-if="error.statusCode === 404">
          {{ pageNotFound }}
        </div>
        <div v-else>
          {{ otherError }}
        </div>
        <v-spacer />
      </v-card-title>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" depressed block @click="toLoginPage"
          ><v-icon left>mdi-home</v-icon>重新登录</v-btn
        >
        <v-spacer />
      </v-card-actions>
    </v-card>
  </v-app>
</template>

<script>
export default {
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      pageNotFound: '404：没有找到该页面',
      otherError: 'Ops，发生了预料之外的错误',
      // 上一次路由
      fromRouter: '',
    }
  },
  head() {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title,
    }
  },
  watch: {},
  methods: {
    toLoginPage() {
      this.$router.replace({
        path: '/',
      })
    },
  },
}
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
