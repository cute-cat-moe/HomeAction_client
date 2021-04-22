<template>
  <v-app>
    <Snackbar :theme-color="routerThemeColor" />
    <v-main>
      <v-container style="height: 100%">
        <nuxt keep-alive class="mb-14" />
      </v-container>
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
      <v-btn v-show="mission === 0">
        <span>{{ routerList[0].name }}</span>
        <v-icon>{{ routerList[0].icon }}</v-icon>
      </v-btn>
      <v-btn v-show="mission !== 0">
        <span>{{ routerList[1].name }}</span>
        <v-icon>{{ routerList[1].icon }}</v-icon>
      </v-btn>
      <v-btn>
        <span>{{ routerList[2].name }}</span>
        <v-icon>{{ routerList[2].icon }}</v-icon>
      </v-btn>
      <v-btn>
        <span>{{ routerList[3].name }}</span>
        <v-icon>{{ routerList[3].icon }}</v-icon>
      </v-btn>
    </v-bottom-navigation>
    <MissionMapDialog />
    <NewsDetailDialog />
    <LostOldDetailEditorDialog />
    <GuideDialog />
  </v-app>
</template>

<script>
import BackToTopButton from '~/components/app/BackToTopButton'
import store from '~/store/index'
import Snackbar from '~/components/app/Snackbar'
import MissionMapDialog from '~/components/mission/MissionMapDialog'
import NewsDetailDialog from '~/components/app/NewsDetailDialog'
import LostOldDetailEditorDialog from '~/components/app/LostOldDetailEditorDialog'
import GuideDialog from '~/components/app/GuideDialog'

export default {
  components: {
    BackToTopButton,
    store,
    Snackbar,
    MissionMapDialog,
    NewsDetailDialog,
    LostOldDetailEditorDialog,
    GuideDialog,
  },

  data: () => ({
    routerThemeColor: '#ffa653',
    routerIndex: 0,
    mission: 0,
    routerList: [
      {
        name: '搜救申请',
        icon: 'mdi-table-edit',
        routerPath: '/',
        themeColor: '#ffa653',
      },
      {
        name: '当前任务',
        icon: 'mdi-book-edit',
        routerPath: '/mission',
        themeColor: '#ffa653',
      },
      {
        name: '新闻中心',
        icon: 'mdi-newspaper-variant-multiple-outline',
        routerPath: '/news',
        themeColor: '#ffa653',
      },
      {
        name: '个人中心',
        icon: 'mdi-account',
        routerPath: '/account',
        themeColor: '#FFB271',
      },
    ],
  }),

  watch: {
    routerIndex(newRouter) {
      console.log('newRouter')
      console.log(newRouter)
      this.$router.replace({
        path: '/relative' + this.routerList[newRouter].routerPath,
      })
      this.$nextTick(() => {
        this.routerThemeColor = this.routerList[this.routerIndex].themeColor
      })
    },
    // 处理路由变化，唤起家属页面的新手指引
    $route(to) {
      this.callGuideDialog(to.name)
    },
  },

  created() {
    // 处理带路由路径的访问
    const routePath = this.$route.path
    let routerCount = 0
    for (const router of this.routerList) {
      if ('/relative' + router.routerPath === routePath) {
        this.routerIndex = routerCount
        break
      }
      routerCount++
    }
    this.routerThemeColor = this.routerList[routerCount].themeColor
    if (this.$store.state.relative.missionID !== 0) {
      this.mission = this.$store.state.relative.missionID
      this.routerIndex = 1
    }
  },

  mounted() {
    this.$Bus.$on('setRelativeRouter', (msg) => {
      console.log('setRelativeRouter')
      console.log(msg)
      this.mission = msg.missionID
      if (
        msg.routerIndex >= 0 &&
        msg.routerIndex < this.routerList.length
      ) {
        this.routerIndex = msg.routerIndex
      } else {
        console.log({
          msgRouterIndex: msg.routerIndex,
          errorInfo: `改变页面路由失败，路由值应大于等于 0 且小于 ${this.routerList.length}！`,
        })
      }
    })

    // 判断用户是否已阅读当前页面的新手指引，若没有，则打开
    this.$nextTick(() => {
      this.callGuideDialog(this.$route.name)
    })
  },
  methods: {
    // 根据家属页面的路由唤起新手指引
    callGuideDialog(routerName) {
      if (localStorage.guideRead) {
        const guideRead = JSON.parse(localStorage.guideRead)
        if (guideRead.relative?.[routerName]) return
      }

      const router = routerName
      const color = this.routerThemeColor

      this.$Bus.$emit('openGuideDialogRelative', {
        router,
        color,
      })
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
