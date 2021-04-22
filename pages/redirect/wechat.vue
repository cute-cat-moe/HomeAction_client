<template>
  <!-- 微信授权登录重定向页面 -->
  <div>
    <v-row style="height: 100vh">
      <v-col cols="12" align-self="center" align="center">
        <Loading v-model="loading" text="正在处理微信登录授权" />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Loading from '~/components/modal/Loading'

export default {
  components: { Loading },
  layout: 'default',
  data: () => ({
    loading: true,
  }),
  async mounted() {
    // 获得登录预授权码 code
    const search = window.location.search.substring(1)
    const vars = search.split('&')
    const code = vars[0].split('=')[1]
  },
}
</script>
