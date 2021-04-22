<template>
  <!-- 飞书授权登录重定向页面 -->
  <div>
    <v-row style="height: 100vh">
      <v-col cols="12" align-self="center" align="center">
        <Loading
          v-if="loading || isValid"
          v-model="loading"
          text="正在处理志愿者飞书登录授权"
        />
        <EmptyStatus
          v-else
          icon="mdi-laravel"
          text="您尚未加入志愿者飞书组织"
          button-text="回到登录界面"
          @confirm="returnLoginPage"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Loading from '~/components/modal/Loading'
import EmptyStatus from '~/components/modal/EmptyStatus'

export default {
  components: { Loading, EmptyStatus },
  layout: 'default',
  data: () => ({
    loading: true,
    isValid: false,
  }),
  async mounted() {
    this.loading = true
    this.isValid = false

    // 获得登录预授权码 code
    const search = window.location.search.substring(1)
    const vars = search.split('&')
    const code = vars[0].split('=')[1]

    // 以下操作应移动到后端进行处理，此处仅作开发演示使用
    // 获取企业自建应用 access_token: tenant_access_token
    // https://open.feishu.cn/document/ukTMukTMukTM/uIjNz4iM2MjLyYzM
    const accessTokenRes = await this.$axios.$post(
      '/feishuapi/auth/v3/tenant_access_token/internal',
      {
        app_id: process.env.feishuAppId,
        app_secret: process.env.feishuAppSecret,
      },
      {
        'Content-Type': 'application/json; charset=utf-8',
      }
    )
    console.log('accessTokenRes', accessTokenRes)
    if (accessTokenRes.code === 0) {
      // 获取 access_token 成功
      const accessToken = accessTokenRes.tenant_access_token

      // 请求用户飞书用户身份
      // https://open.feishu.cn/document/ukTMukTMukTM/uEDO4UjLxgDO14SM4gTN
      const userInfoRes = await this.$axios.$post(
        '/feishuapi/authen/v1/access_token',
        {
          grant_type: 'authorization_code',
          code,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json; charset=utf-8',
          },
        }
      )
      console.log('userInfoRes', userInfoRes)
      if (userInfoRes.code === 0) {
        // 获取用户信息成功
        // userAccessToken 为请求用户资源的 access_token
        const userAccessToken = userInfoRes.access_token

        this.isValid = true

        this.$router.replace({
          path: '/volunteer/',
        })
      } else {
        // 获取用户信息失败，处理异常
        this.$router.replace({
          path: '/login',
        })
      }
    } else {
      // 获取 access_token 失败，处理异常
      this.$router.replace({
        path: '/login',
      })
    }

    this.loading = false
  },
  methods: {
    returnLoginPage() {
      this.$router.push({
        path: '/login',
      })
    },
  },
}
</script>
