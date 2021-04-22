<template>
  <v-app>
    <Snackbar :theme-color="routerThemeColor" />

    <v-main>
      <nuxt keep-alive class="mb-15" />
    </v-main>

    <BackToTopButton :theme-color="routerThemeColor" />

    <v-bottom-navigation
      v-model="routerIndex"
      :background-color="routerThemeColor"
      app
      dark
      grow
      fixed
    >
      <v-btn v-for="router in routerList" :key="router.routerPath">
        <span>{{ router.name }}</span>
        <v-icon>{{ router.icon }}</v-icon>
      </v-btn>
    </v-bottom-navigation>

    <ConvenerDetailDialog :role="role" />
    <MemberDialog />
    <NewsDetailDialog />

    <GuideDialog />
  </v-app>
</template>

<script>
import BackToTopButton from '~/components/app/BackToTopButton'
import ConvenerDetailDialog from '~/components/app/ConvenerDetailDialog'
import MemberDialog from '~/components/app/MemberDialog'
import NewsDetailDialog from '~/components/app/NewsDetailDialog'
import Snackbar from '~/components/app/Snackbar'
import GuideDialog from '~/components/app/GuideDialog'

export default {
  components: {
    BackToTopButton,
    ConvenerDetailDialog,
    MemberDialog,
    NewsDetailDialog,
    Snackbar,
    GuideDialog,
  },

  data: () => ({
    // 志愿者身份
    role: '',
    routerThemeColor: '#D32F2F',
    routerIndex: 0,
    routerList: [
      {
        name: '首页',
        icon: 'mdi-home',
        routerPath: '',
        themeColor: '#D32F2F',
      },
      {
        name: '当前任务',
        icon: 'mdi-book-edit',
        routerPath: 'mission',
        themeColor: '#00897B',
      },
      {
        name: '救援召集',
        icon: 'mdi-message-text',
        routerPath: 'convener',
        themeColor: '#1976D2',
      },
      {
        name: '个人中心',
        icon: 'mdi-account',
        routerPath: 'account',
        themeColor: '#546E7A',
      },
    ],
  }),

  watch: {
    // 监听点击下方的按钮切换路由
    routerIndex(newRouter) {
      this.$router.replace({
        path: '/volunteer/' + this.routerList[newRouter].routerPath,
      })
      this.$nextTick(() => {
        this.routerThemeColor = this.routerList[this.routerIndex].themeColor
      })
    },
    // 处理路由变化，唤起志愿者页面的新手指引
    $route(to) {
      this.callGuideDialog(to.name)
    },
  },

  created() {
    // 处理带路由路径的访问
    const routePath = this.$route.path

    let routerCount = 0
    // '/volunteer' 默认为主页路由
    if (routePath !== '/volunteer') {
      const selectPath = routePath.split('/')[2]
      for (const router of this.routerList) {
        if (router.routerPath === selectPath) {
          break
        }
        routerCount++
      }
    }
    this.routerIndex = routerCount
    this.routerThemeColor = this.routerList[routerCount].themeColor

    // 设置志愿者用户的身份信息
    // const role = 'volunteer'
    const role = 'leader'
    localStorage.volunteerRole = role
    this.role = role
  },

  mounted() {
    this.$Bus.$on('setVolunteerRouter', (msg) => {
      if (
        msg.routerIndex &&
        msg.routerIndex >= 0 &&
        msg.routerIndex < this.routerList.length
      ) {
        this.routerIndex = msg.routerIndex
      } else {
        console.log({
          msgRouterIndex: msg.routerIndex,
          errorInfo: `改变志愿者页面路由失败，路由值应大于等于 0 且小于 ${this.routerList.length}！`,
        })
      }
    })

    // if (this.routerIndex !== 3) {
    //   this.$Bus.$emit('showAlert', {
    //     alertText: '您当前处于忙碌状态，可以前往设置备勤状态',
    //     actionFunction: () => {
    //       this.$Bus.$emit('setVolunteerRouter', {
    //         routerIndex: 3,
    //       })
    //     },
    //   })
    // }

    // 判断用户是否已阅读当前页面的新手指引，若没有，则打开
    this.$nextTick(() => {
      this.callGuideDialog(this.$route.name)
    })
  },

  methods: {
    // 根据志愿者页面的路由唤起新手指引
    callGuideDialog(routerName) {
      if (localStorage.guideRead) {
        const guideRead = JSON.parse(localStorage.guideRead)
        if (guideRead.volunteer?.[routerName]) return
      }

      // TODO: 根据用户组获取用户类型，类型包括 volunteer 和 leader
      const type = 'volunteer'

      const router = routerName
      const color = this.routerThemeColor

      if (type === 'volunteer') {
        this.$Bus.$emit('openGuideDialogVolunteer', {
          router,
          color,
        })
      } else if (type === 'leader') {
        this.$Bus.$emit('openGuideDialogLeader', {
          router,
          color,
        })
      }
    },
  },
}
</script>

<style lang="scss">
.dialog-toolbar {
  position: fixed;
  z-index: 999;
}

.dialog-bottom-toolbar {
  position: fixed;
  z-index: 999;
  bottom: 0;
}

.dialog-container {
  padding-top: 56px;
  padding-bottom: 64px;
}
</style>
