<template>
  <!-- 登录选择页面 -->
  <div>
    <v-card
      v-for="info in loginInfo"
      :key="info.title"
      outlined
      max-width="600"
      class="session-card my-2"
      @mouseenter="info.hover = true"
      @mouseleave="info.hover = false"
    >
      <v-row no-gutters class="session-card">
        <v-col cols="5" align-self="center">
          <v-img :src="info.imgSrc" min-height="25vh" />
        </v-col>
        <v-col cols="7" align-self="center" class="login-info">
          <v-card-title class="login-info-title font-weight-bold">
            我是<span :style="info.titleStyle">{{
              info.title
            }}</span></v-card-title
          >
          <v-card-subtitle class="login-info-subtitle">{{
            info.subtitle
          }}</v-card-subtitle>
          <v-card-text class="login-info-content">{{
            info.content
          }}</v-card-text>
          <v-card-actions class="mx-2">
            <v-btn
              :elevation="info.hover ? 6 : 2"
              :color="info.color"
              dark
              block
              x-large
              @click="confirmLogin(info.select)"
              >{{ info.buttonText }}</v-btn
            >
          </v-card-actions>
        </v-col>
      </v-row>

      <v-fade-transition>
        <v-overlay
          :value="!info.hover"
          absolute
          opacity="0.6"
          color="#f2f2f2"
          z-index="2"
        />
      </v-fade-transition>
    </v-card>

    <LoginConfirmDialog
      v-model="loginConfirmDialog"
      :title="loginConfirmDialogTitle"
      :text="loginConfirmDialogText"
      :color="loginConfirmDialogColor"
      @confirm="login()"
    />
  </div>
</template>

<script>
import LoginConfirmDialog from '~/components/modal/ConfirmDialog'

export default {
  components: { LoginConfirmDialog },
  layout: 'default',
  data: () => ({
    loginInfo: [
      {
        select: 'relative',
        title: '家属',
        subtitle: '使用手机号验证登录',
        content: '家里老人走失，需志愿者帮助搜寻老人',
        buttonText: '家属登录',
        imgSrc: '/login-relative.png',
        color: '#1976D2',
        titleStyle: 'color: #1976D2;',
        hover: false,
      },
      {
        select: 'volunteer',
        title: '志愿者',
        subtitle: '使用飞书授权登录',
        content: '参与志愿服务，帮助家庭搜寻走失老人',
        buttonText: '志愿者登录',
        imgSrc: '/login-volunteer.png',
        color: '#D32F2F',
        titleStyle: 'color: #D32F2F;',
        hover: false,
      },
    ],
    // 确认登录对话框
    loginConfirmDialog: false,
    select: '',
    baseUrl: '192.168.1.102',
    // 飞书重定向链接
    redirectUrlVolunteer: 'http://127.0.0.1:12323/redirect/feishu',
    // 微信重定向链接
    redirectUrlRelative: 'http://127.0.0.1:12323/redirect/wechat',
  }),
  computed: {
    loginConfirmDialogTitle() {
      return this.select === 'volunteer' ? '以志愿者身份登录' : '以家属身份登录'
    },
    loginConfirmDialogText() {
      return this.select === 'volunteer'
        ? '将使用飞书验证授权登录，请确保您已加入志愿者的飞书组织'
        : '将使用手机号验证授权登录'
    },
    loginConfirmDialogColor() {
      return this.select === 'volunteer' ? '#D32F2F' : '#1976D2'
    },
  },
  created() {
    // TODO: 移除已存储的所有信息
    // this.baseUrl = '127.0.0.1'
    this.baseUrl = '192.168.1.102'
    this.redirectUrlVolunteer = 'http://'+ this.baseUrl+ ':12323/redirect/feishu'
    this.redirectUrlRelative = 'http://'+ this.baseUrl+ ':12323/redirect/wechat'
  },
  methods: {
    // 确认登录身份对话框
    confirmLogin(select) {
      this.select = select
      this.loginConfirmDialog = true
    },
    // 点击对话框确认按钮
    login() {
      this.select === 'volunteer' ? this.loginVolunteer() : this.loginRelative()
    },
    // 家属登录
    loginRelative() {
      console.log('家属登录')
      const redirectUrl = encodeURI(this.redirectUrlRelative)
      this.$router.replace({
        path: '/relative/login',
      })
    },
    // 志愿者登录
    loginVolunteer() {
      const redirectUrl = encodeURI(this.redirectUrlVolunteer)
      window.location.href = `https://open.feishu.cn/open-apis/authen/v1/index?redirect_uri=${redirectUrl}&app_id=${process.env.feishuAppId}`
    },
  },
}
</script>

<style lang="scss" scoped>
.session-card {
  height: calc(50vh - 12px);
  margin: 0 auto;
}

.login-info {
  z-index: 3;
}

.login-info-title {
}

.login-info-subtitle {
}

.login-info-content {
  font-size: 16px;
}
</style>
