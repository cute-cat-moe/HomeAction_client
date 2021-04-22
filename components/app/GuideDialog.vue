<template>
  <!-- eslint-disable vue/no-parsing-error -->
  <!-- 新手指引对话框 -->
  <v-dialog v-model="dialog" max-width="600" persistent>
    <v-card class="rounded-lg">
      <v-row v-if="guideSource[index]" no-gutters>
        <v-card-title
          class="py-2 mx-auto opacity-secondary"
          style="font-size: 14px"
        >
          {{ index + 1 }} / {{ guideSource.length }}</v-card-title
        >
        <v-col
          v-show="guideSource[index].photo"
          cols="12"
          align="center"
          align-self="center"
        >
          <v-img :src="guideSource[index].photo" width="100%" height="100%" />
        </v-col>
        <v-col cols="12" align="center" align-self="center">
          <v-card-text class="pt-6 pb-0" style="font-size: 16px">{{
            guideSource[index].text
          }}</v-card-text>
          <v-card-subtitle
            v-show="guideSource[index].comment"
            class="pt-2 pb-0"
            >{{ guideSource[index].comment }}</v-card-subtitle
          >
        </v-col>
      </v-row>
      <v-card-actions class="pt-6">
        <v-btn text @click="skipConfirmDialog = true">跳过</v-btn>
        <v-spacer />
        <v-btn depressed :disabled="index === 0" @click="index -= 1"
          ><v-icon left>mdi-arrow-left</v-icon>上一步</v-btn
        >
        <v-btn
          class="ml-2"
          depressed
          :color="color"
          dark
          @click="
            index < guideSource.length - 1 ? (index += 1) : recordGuideRead()
          "
          >{{ index < guideSource.length - 1 ? '下一步' : '完成'
          }}<v-icon right>{{
            index < guideSource.length - 1 ? 'mdi-arrow-right' : 'mdi-check'
          }}</v-icon></v-btn
        >
      </v-card-actions>
    </v-card>

    <ConfirmDialog
      v-model="skipConfirmDialog"
      title="跳过指引"
      text="您可以随时在个人中心页面的帮助反馈处重置指引，您确定要跳过当前页面的指引吗？"
      :color="color"
      @confirm="skipGuide()"
    />
  </v-dialog>
</template>

<script>
import ConfirmDialog from '~/components/modal/ConfirmDialog'

// 新手指引资料数组
const guideVolunteerIndex = [
  {
    photo: '/old-man.jpg',
    text: '这是一段关于主页的介绍',
    comment: '这是一段可选的次要文本',
  },
  {
    photo: '/old-woman.jpg',
    text: '这是另一段关于主页的介绍，但没有次要文本',
  },
  {
    photo: '/old-man.jpg',
    text: '感谢您的阅读，敬请使用！',
  },
]
const guideVolunteerMission = []
const guideVolunteerConvener = []
const guideVolunteerAccount = []
const guideLeaderIndex = []
const guideLeaderMission = []
const guideLeaderConvener = []
const guideLeaderAccount = []
const guideRelativeIndex = []
const guideRelativeMission = []
const guideRelativeNews = []
const guideRelativeAccount = []

export default {
  components: { ConfirmDialog },
  data: () => ({
    dialog: false,
    skipConfirmDialog: false,
    // 主题色
    color: 'primary',
    // 当前对话框进度
    index: 0,
    // 新手指引资料
    guideSource: [],
    guideType: '',
    guideRouter: '',
  }),
  mounted() {
    // 注册志愿者的新手指导
    // msg 传入 router 和 color 两项
    // router 对应为 $route.name
    // color 对应为路由的 routerThemeColor
    // 下同
    this.$Bus.$on('openGuideDialogVolunteer', (msg) => {
      this.resetGuideDialog()
      const router = msg.router
      if (!router) return

      switch (router) {
        case 'volunteer':
          this.guideSource = guideVolunteerIndex
          break
        case 'volunteer-mission':
          this.guideSource = guideVolunteerMission
          break
        case 'volunteer-convener':
          this.guideSource = guideVolunteerConvener
          break
        case 'volunteer-account':
          this.guideSource = guideVolunteerAccount
          break
        default:
          console.log('唤起指引失败，志愿者端路由名不正确')
          return
      }

      this.color = msg.color || 'primary'
      this.guideType = 'volunteer'
      this.guideRouter = router
      this.$nextTick(() => {
        this.dialog = true
      })
    })
    // 注册领队的新手指导
    this.$Bus.$on('openGuideDialogLeader', (msg) => {
      this.resetGuideDialog()
      const router = msg.router
      if (!router) return

      switch (router) {
        case 'volunteer':
          this.guideSource = guideLeaderIndex
          break
        case 'volunteer-mission':
          this.guideSource = guideLeaderMission
          break
        case 'volunteer-convener':
          this.guideSource = guideLeaderConvener
          break
        case 'volunteer-account':
          this.guideSource = guideLeaderAccount
          break
        default:
          console.log('唤起指引失败，领队端路由名不正确')
          return
      }

      this.color = msg.color || 'primary'
      this.guideType = 'Leader'
      this.guideRouter = router
      this.$nextTick(() => {
        this.dialog = true
      })
    })
    // 注册家属的新手指导
    this.$Bus.$on('openGuideDialogRelative', (msg) => {
      this.resetGuideDialog()
      const router = msg.router
      if (!router) return

      switch (router) {
        case 'relative':
          this.guideSource = guideRelativeIndex
          break
        case 'relative-mission':
          this.guideSource = guideRelativeMission
          break
        case 'relative-news':
          this.guideSource = guideRelativeNews
          break
        case 'relative-account':
          this.guideSource = guideRelativeAccount
          break
        default:
          console.log('唤起指引失败，家属端路由名不正确')
          return
      }

      this.color = msg.color || 'relativeColor'
      this.guideType = 'relative'
      this.guideRouter = router
      this.$nextTick(() => {
        this.dialog = true
      })
    })
  },
  methods: {
    // 重设新手指导对话框数据
    resetGuideDialog() {
      this.color = 'primary'
      this.index = 0
      this.guideSource = []
    },
    // 记录已看过当前页面的新手指引
    recordGuideRead() {
      const router = this.guideRouter
      const type = this.guideType
      if (!router || !type) return

      const guideRead = localStorage.guideRead
        ? JSON.parse(localStorage.guideRead)
        : {}
      if (!guideRead[type]) {
        guideRead[type] = {}
      }
      guideRead[type][router] = true
      localStorage.guideRead = JSON.stringify(guideRead)

      this.dialog = false
    },
    // 跳过当前页面的新手指引
    skipGuide() {
      this.skipConfirmDialog = false
      this.dialog = false

      // 记录当前页面已阅读
      this.recordGuideRead()
    },
  },
}
</script>
