<template>
  <div>
    <v-app-bar color="relativeColor" app dark dense fixed>
      <v-btn icon @click="showMissionLevelIntro"
      ><v-icon>mdi-android-auto</v-icon></v-btn
      >

      <v-app-bar-title class="pl-1">
        任务等级：{{ mission.missionDetail.level }}级
      </v-app-bar-title>

      <v-spacer />

      <v-btn icon @click="showMissionPastTime"
      ><v-icon>mdi-clock-time-four</v-icon></v-btn
      >

      <v-app-bar-title class="pl-1">
        32 小时 <span class="body-1 opacity-primary">47 分钟</span>
      </v-app-bar-title>
    </v-app-bar>

    <v-card outlined color="#f5f5f5" class="mb-12">
      <v-card-title>
        <v-btn icon @click="testStatus">
          <v-icon left>mdi-book-edit</v-icon>
        </v-btn>
        任务进度-
        <span
          v-model="mission.missionDetail.status"
          class="body-1 opacity-primary"
        >{{ tabs[mission.missionDetail.status - 1] }}
        </span>
      </v-card-title>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          class="ma-2 white--text"
          color="red"
          @click="endMission"
        >申请结束
        </v-btn>
        <v-btn
          class="ma-2 white--text"
          color="relativeColor"
          @click="dialog = true"
        >
          老人信息
        </v-btn>
      </v-card-actions>
      <v-stepper v-model="mission.missionDetail.status" vertical>
        <v-stepper-step
          :complete="mission.missionDetail.status > 1"
          step="1"
          color="relativeColor"
        >
          救援申请
        </v-stepper-step>

        <v-stepper-items>
          <v-stepper-content step="1">
            <v-container>
              <v-card
                outlined
                :elevation="missionCardElevation"
                height="200px"
                :color="missionCardColor"
              >
                <v-card-title>
                  <v-icon left>mdi-clipboard-edit-outline</v-icon>
                  任务审核状态
                </v-card-title>

                <v-card-text>
                  <v-row align="center" class="mx-0">
                    <v-col v-if="mission.missionDetail.status === 0">
                      审核未通过
                    </v-col>
                    <v-col v-else-if="mission.missionDetail.status === 1">
                      审核中
                    </v-col>
                    <v-col v-else> 审核通过 </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-container>
          </v-stepper-content>

          <v-stepper-step
            :complete="mission.missionDetail.status > 2"
            step="2"
            color="relativeColor"
          >
            队伍召集
          </v-stepper-step>

          <v-stepper-content step="2">
            <v-container>
              <!-- 任务的额外操作
                    class="py-4 rounded-lg" -->
              <v-row justify="center">
                <v-col cols="12" align="center">
                  <v-card
                    outlined
                    elevation="1"
                    @click="completeLostOldDetail"
                    :color="missionCardColor"
                  >
                    <div class="pt-2"><v-icon x-large>mdi-clipboard-plus-outline</v-icon></div>
                    <div class="pt-2 body-1 opacity-secondary">完善信息</div>
                  </v-card>
                </v-col>
              </v-row>

              <v-row justify="center">
                <v-col cols="12" align="center">
                  <v-card
                    outlined
                    :elevation="missionCardElevation"
                    :color="missionCardColor"
                  >
                    <v-card-title>
                      <v-icon left>mdi-clipboard-list-outline</v-icon>
                      任务召集信息
                    </v-card-title>
                    <v-card-text>
                      <v-row align="center">
                        <v-col cols="4" :class="detailDesCSS"> 负责人姓名 </v-col>
                        <v-col cols="8" :class="detailValueCSS">
                          {{ mission.missionDetail.principal.name }}
                        </v-col>
                      </v-row>

                      <v-row align="center">
                        <v-col cols="4" :class="detailDesCSS"> 负责人电话 </v-col>
                        <v-col cols="8" :class="detailValueCSS">
                          {{ mission.missionDetail.principal.telephone }}
                        </v-col>
                      </v-row>

                      <v-row align="center">
                        <v-col cols="4" :class="detailDesCSS"> 队伍召集进度 </v-col>
                        <v-col cols="8">
                          <v-progress-linear
                            height="20"
                            buffer-value="100"
                            :value="
                          (mission.missionDetail.called /
                            mission.missionDetail.need) *
                          100
                        "
                            rounded
                            striped
                            color="relativeColor"
                          >
                            <template>
                              <strong class="white--text"
                              >{{ mission.missionDetail.called }} /
                                {{ mission.missionDetail.need }} 人</strong
                              >
                            </template>
                          </v-progress-linear>
                        </v-col>
                      </v-row>
                      <v-container></v-container>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>

              <!--              <v-card-->
              <!--                outlined-->
              <!--                class="mt-8"-->
              <!--                :elevation="missionCardElevation"-->
              <!--                :color="missionCardColor"-->
              <!--              >-->
              <!--                <v-card-title>-->
              <!--                  <v-icon left>mdi-clipboard-plus-outline</v-icon>-->
              <!--                  完善老人信息-->
              <!--                </v-card-title>-->

              <!--                <v-row justify="center">-->
              <!--                  <v-btn-->
              <!--                    class="mx-2"-->
              <!--                    fab-->
              <!--                    dark-->
              <!--                    color="relativeColor"-->
              <!--                    @click="completeLostOldDetail"-->
              <!--                  >-->
              <!--                    <v-icon dark> mdi-plus-circle </v-icon>-->
              <!--                  </v-btn>-->
              <!--                </v-row>-->
              <!--                <v-container></v-container>-->
              <!--              </v-card>-->
            </v-container>
          </v-stepper-content>

          <v-stepper-step
            :complete="mission.missionDetail.status > 3"
            step="3"
            color="relativeColor"
          >
            任务进行
          </v-stepper-step>

          <v-stepper-content step="3">
            <v-container>

              <!-- 任务的额外操作
                    class="py-4 rounded-lg" -->
              <v-row justify="center">
                <v-col cols="3" align="center">
                  <v-card
                    outlined
                    elevation="1"
                    @click="completeLostOldDetail"
                    :color="missionCardColor"
                  >
                    <div class="pt-2"><v-icon x-large>mdi-clipboard-plus-outline</v-icon></div>
                    <div class="pt-2 body-1 opacity-secondary">完善信息</div>
                  </v-card>
                </v-col>
                <v-col cols="3" align="center">
                  <v-card
                    outlined
                    elevation="1"
                    @click="openMissionMapDialog"
                    :color="missionCardColor"
                  >
                    <div class="pt-2">
                      <v-icon x-large>mdi-map</v-icon>
                    </div>
                    <div class="pt-2 body-1 opacity-secondary">搜救地图</div>
                  </v-card>
                </v-col>

                <v-col cols="3" align="center">
                  <v-card
                    outlined
                    elevation="1"
                    @click="showMissionFeedback"
                    :color="missionCardColor"
                  >
                    <div class="pt-2"><v-icon x-large>mdi-calendar-text</v-icon></div>
                    <div class="pt-2 body-1 opacity-secondary">搜救反馈</div>
                  </v-card>
                </v-col>

                <v-col cols="3" align="center">
                  <v-card
                    outlined
                    elevation="1"
                    @click="showUncertainOld"
                    :color="missionCardColor"
                  >
                    <div class="pt-2"><v-icon x-large>mdi-account-question</v-icon></div>
                    <div class="pt-2 body-1 opacity-secondary">疑似老人</div>
                  </v-card>
                </v-col>
              </v-row>

              <ContentTitle>
                任务公告栏
                <template #action>
                  <v-btn depressed @click="missionMessageAddDialog = true"
                  >发表公告</v-btn
                  >
                  <v-btn depressed icon @click="refreshMissionMessage"
                  ><v-icon large>mdi-refresh-circle</v-icon></v-btn>
                </template>
              </ContentTitle>
              <MissionMessageBoard :message="mission.missionMessage" />

            </v-container>
          </v-stepper-content>

          <v-stepper-step
            :complete="
              mission.missionDetail.status > 4
            "
            step="4"
            color="relativeColor"
          >
            任务结束
          </v-stepper-step>

          <v-stepper-content step="4">
            <v-container>
              <v-card
                outlined
                :elevation="missionCardElevation"
                :color="missionCardColor"
              >
                <v-card-title>
                  <v-icon left @click="changeSucc">mdi-clipboard-play-outline</v-icon>
                  任务结束
                </v-card-title>

                <v-card-text>
                  <v-row align="center" class="mx-0">
                    <v-col v-if="mission.success">
                      成功找到老人，点击下方按钮以退出当前按钮界面。
                    </v-col>
                    <v-col v-else>
                      未找到老人，建议尽快报警以寻求警察的帮助。点击下方按钮，跳转至报警界面。
                    </v-col>
                  </v-row>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    v-if="mission.success"
                    color="relativeColor"
                    class="mx-2 white--text"
                    @click="quitMission"
                  >
                    退出
                  </v-btn>
                  <v-btn
                    v-else
                    color="red"
                    class="mx-2 white--text"
                    @click="telephoneCall"
                  >
                    报警
                  </v-btn>
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-container>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>

      <!--显示老人信息弹窗-->
      <v-dialog
        v-model="dialog"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
        scrollable
      >
        <v-card color="#f2f2f2">
          <v-card-title>
            <span class="headline">老人信息</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <MissionLostOldDetail
                    :lost-old-detail="mission.lostOldDetail"
                    :baseUrl="baseUrl"
                  />
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="relativeColor"
              class="mx-2 white--text"
              @click="dialog = false"
            >
              返回
            </v-btn>
            <v-btn
              color="relativeColor"
              class="mx-2 white--text"
              @click="completeLostOldDetail"
            >
              完善
            </v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- 申请结束任务对话框 -->
      <ConfirmDialog
        v-model="missionLeaveDialog"
        :custom="true"
        title="结束任务"
        color="relativeColor"
        :confirm-auto-close="false"
        :loading="loading"
        @confirm="toConfirmLeaveMission()"
      >
        <div class="pb-2">您可以在下方输入您结束任务的原因。</div>
        <v-textarea
          v-model="missionLeaveReason"
          label="结束任务原因*"
          auto-grow
          filled
          rows="2"
          color="relativeColor"
        ></v-textarea>
      </ConfirmDialog>

      <!-- 确认离开任务对话框 -->
      <ConfirmDialog
        v-model="missionLeaveConfirmDialog"
        title="确定结束任务"
        text="您将结束当前任务，确定要继续吗？"
        color="relativeColor"
        confirm-input="结束任务"
        @confirm="leaveMission()"
      />

      <!--显示搜救反馈信息弹窗-->
      <v-dialog
        v-model="dialog2"
        fullscreen
        hide-overlay
        persistent
        transition="dialog-bottom-transition"
      >
        <v-card>
          <v-toolbar
            class="dialog-toolbar"
            dark
            color="relativeColor"
            width="100%"
          >
            <v-btn icon dark @click="dialog2 = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title class="px-3">任务反馈</v-toolbar-title>
            <v-spacer />
            <v-btn depressed dark icon @click="refreshMissionFeedback"
            ><v-icon large>mdi-refresh</v-icon></v-btn>
          </v-toolbar>
          <div class="pt-14 pb-16">
            <v-container class="pa-4" v-if="mission.missionFeedback.length === 0">
              暂无任务反馈！
            </v-container>
            <v-container class="pa-4" v-else>
              <!-- 查看所有任务反馈信息页面 -->
              <div>
                <v-card
                  v-for="feedback in mission.missionFeedback"
                  :key="feedback.id"
                  class="rounded-lg mb-4"
                  outlined
                  elevation="2"
                  color='#f2f2f2'
                >
                  <v-card-title class="feedback-title pb-1">{{
                    feedback.name
                    }}</v-card-title>
                  <v-divider class="mx-2" />
                  <v-card-subtitle class="feedback-subtitle pt-1">
                    {{ $Dayjs.formatDateTime(feedback.date, 'MM-DD hh:mm')
                    }}{{ feedback.team_id ? `，第 ${feedback.team_id} 小队 ${feedback.team_identity}` : '' }}
                  </v-card-subtitle>
                  <v-card-text class="feedback-content">
                    {{ feedback.feedback }}
                  </v-card-text>
                  <v-card-text
                    v-if="feedback.comment"
                    class="feedback-content pt-0"
                  >
                    <span class="opacity-secondary">备注 </span>
                    {{ feedback.comment }}</v-card-text
                  >
                </v-card>
              </div>
            </v-container>
          </div>
          <v-toolbar class="dialog-bottom-toolbar" width="100%" elevation="1">
            <v-spacer />
            <v-toolbar-items>
              <v-container>
                <v-btn
                  color="relativeColor"
                  class="ml-2"
                  dark
                  @click="dialog2 = false"
                >关闭页面</v-btn
                ></v-container>
            </v-toolbar-items>
          </v-toolbar>
        </v-card>
      </v-dialog>

      <!--显示疑似老人信息弹窗-->
      <v-dialog
        v-model="dialog3"
        fullscreen
        hide-overlay
        persistent
        transition="dialog-bottom-transition"
      >
        <v-card>
          <v-toolbar
            class="dialog-toolbar"
            dark
            color="relativeColor"
            width="100%"
          >
            <v-btn icon dark @click="dialog3 = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title class="px-3">疑似老人</v-toolbar-title>
            <v-spacer />
            <v-btn depressed dark icon @click="refreshUncertainOld"
            ><v-icon large>mdi-refresh</v-icon></v-btn>
          </v-toolbar>
          <div class="pt-14 pb-16">
            <v-container class="pa-4" v-if="mission.uncertainOld.length === 0">
              暂未发现疑似老人！
            </v-container>
            <v-container class="pa-4" v-else>
              <!-- 查看所有任务反馈信息页面 -->
              <div>
                <v-card
                  v-for="Old in mission.uncertainOld"
                  :key="Old.id"
                  class="rounded-lg mb-4"
                  style="border-color: #f2f2f2"
                  outlined
                  elevation="3"
                  color='#f2f2f2'
                >
                  <v-carousel
                    :cycle="carouselCycle"
                    :height="carouselHeight"
                    hide-delimiter-background
                    show-arrows-on-hover
                  >
                    <v-carousel-item v-for="photo in Old.photos" :key="photo.id">
                      <v-img
                        :src="baseUrl + photo.path"
                        :height="carouselHeight"
                        @click="switchPhotoView"
                      ></v-img>
                    </v-carousel-item>
                  </v-carousel>

                  <v-card-text class="uncertain-content black--text">
                    <v-row>
                      <v-icon left>mdi-map-marker</v-icon>
                      发现位置：{{ Old.findLocation.name }}
                    </v-row>
                  </v-card-text>
                  <v-card-text class="uncertain-content black--text">
                    <v-row>
                      <v-icon left>mdi-clock-time-five-outline</v-icon>
                      发现时间：{{ $Dayjs.formatDateTime(Old.time, 'YYYY-MM-DD hh:mm') }}
                    </v-row>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click="" >
                      具体位置
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </div>
            </v-container>
          </div>
          <v-toolbar class="dialog-bottom-toolbar" width="100%" elevation="1">
            <v-spacer />
            <v-toolbar-items>
              <v-container>
                <v-btn
                  color="relativeColor"
                  class="ml-2"
                  dark
                  @click="dialog3 = false"
                >关闭页面</v-btn
                ></v-container>
            </v-toolbar-items>
          </v-toolbar>
        </v-card>
      </v-dialog>

    </v-card>
    <MissionMapDialog
      v-model="missionMapDialog"
      :mission-map-detail="mission.missionMapDetail"
      :mission-team-detail="mission.missionTeamDetail"/>
  </div>
</template>

<script>
  import ContentTitle from '~/components/modal/ContentTitle'
  import ConfirmDialog from '~/components/modal/ConfirmDialog'
  import MissionLostOldDetail from '~/components/modal/LostOldDetail'
  import MissionMessageBoard from '~/components/mission/MissionMessageBoard'
  import MissionMapDialog from '~/components/mission/MissionMapDialog'

  export default {
    components: {
      ContentTitle,
      ConfirmDialog,
      MissionLostOldDetail,
      MissionMessageBoard,
      MissionMapDialog,
    },
    layout: 'relative',
    data: () => ({
      baseUrl: 'http://47.98.154.166:3000',
      // 修改任务设置时加载动画
      loading: false,
      carouselHeight: '25vh',
      dialog: false,
      dialog2: false,
      dialog3: false,
      missionLeaveDialog: false,
      // 确认离开任务对话框
      missionLeaveConfirmDialog: false,
      missionLeaveReason: '',
      missionCardElevation: 1,
      missionCardColor: 'rgba(219,200,177,0.4)',
      tabs: ['救援申请', '队伍召集', '任务进行', '任务结束', '任务结束'],
      detailDesCSS: 'text-body-2 opacity-secondary',
      detailValueCSS: 'text-body-1 font-weight-medium',
      missionId: '123',
      mission: {
        description: '成华区一老人走失，82岁女性，身穿紫色衬衫，爱好下象棋',
        success: true,
        missionDetail: {},
        lostOldDetail: {},
        missionMessage: [],
        missionFeedback: [],
        uncertainOld: [],
        missionMapDetail: {
          lastKnownLocation: {
            name: '东桂四号院',
            lnglat: [104.130654, 30.644395],
            radius: 100,
          },
          starLocation: [
            {
              name: '塔子山公园',
              lnglat: [104.123912, 30.634898],
            },
            {
              name: '成都市体育运动学校',
              lnglat: [104.129866, 30.640283],
              radius: 100,
            },
          ],
          markLocation: [
            {
              id: 0,
              tid: 1,
              name: '救助区小站',
              lnglat: [104.129027, 30.646121],
              radius: 50,
              content: '在救助区小站 50 米内展开搜寻',
            },
            {
              id: 1,
              tid: 2,
              name: '佳年华广场',
              lnglat: [104.130987, 30.628134],
            },
          ],
        },
        missionMemberDetail: [
          {
            uid: 123,
            name: '杰哥',
            telephone: '18980340000',
            wechat: '18980340000',
            photo: '',
            quit: false,
          },
          {
            uid: 124,
            name: '伦哥',
            telephone: '18980340001',
            wechat: '18980340001',
            photo: '',
            quit: false,
          },
          {
            uid: 125,
            name: '张哥',
            telephone: '18980340002',
            wechat: '18980340002',
            photo: '',
            quit: true,
          },
          {
            uid: 126,
            name: '王姐',
            telephone: '18980340003',
            wechat: '18980340003',
            photo: '',
            quit: false,
          },
          {
            uid: 127,
            name: 'Dio',
            telephone: '18980340004',
            wechat: '18980340004',
            photo: '',
            quit: false,
          },
        ],
        missionTeamDetail: [
          {
            tid: 1,
            members: [123, 125, 126],
            leader: 123,
          },
          {
            tid: 2,
            members: [124, 127],
            leader: 124,
          },
        ],
      },
      missionMapDialog: false,
    }),

    computed: {
      carouselCycle() {
        // 小图模式自动切换照片
        switch (this.carouselHeight) {
          case '40vh':
            return true
          default:
            return false
        }
      },
    },

    created() {
      // 初始化任务详细信息
      this.setData()
      // 任务失败结束
      if (this.mission.missionDetail.status === 5) {
        this.$store.commit('relative/updateTest', 4)
        this.mission.success = false
      }
    },

    methods: {
      endMission() {
        this.missionLeaveDialog = true
      },
      // 打开确认离开任务对话框
      toConfirmLeaveMission() {
        this.missionLeaveConfirmDialog = true
      },
      // TODO: 离开任务
      leaveMission() {
        this.loading = true
        const leaveReason = this.missionLeaveReason

        this.loading = false
        this.missionLeaveDialog = false
      },
      changeSucc() {
        this.mission.success = !this.mission.success
      },
      showMissionLevelIntro() {
        this.$Bus.$emit('openSnackbar', {
          text: `当前任务为${this.mission.missionDetail.level}`,
        })
      },
      showMissionPastTime() {
        this.$Bus.$emit('openSnackbar', {
          text: `当前任务已经过 ${this.mission.missionDetail.pastTime}`,
        })
      },
      openMissionMapDialog() {
        this.missionMapDialog = true
      },
      modifyLostOldDetail() {
        this.$Bus.$emit('editLostOldDetail', {
          mode: 'modify',
          lostOldId: '23124',
        })
        this.$nextTick(() => {
          console.log(111)
        })
      },
      completeLostOldDetail() {
        this.$Bus.$emit('editLostOldDetail', {
          mode: 'complete',
          lostOldId: '23124',
        })
      },
      testStatus() {
        this.$store.commit('relative/updateTestStatus')
      },
      // 退出当前任务界面
      quitMission() {
        this.$store.commit('relative/quitMission', 0)
        console.log('ID:'+this.$store.state.relative.missionID)
        // 切换路由到救援申请界面
        this.$Bus.$emit('setRelativeRouter', {
          routerIndex: 0,
          missionID: this.$store.state.relative.missionID,
        })
      },
      // 报警
      telephoneCall() {
        window.location.href = `tel://13228202068`
      },
      setData() {
        this.mission.missionDetail = this.$store.state.relative.missionInfo.missionDetail
        this.mission.lostOldDetail = this.$store.state.relative.missionInfo.lostOldDetail
        console.log(this.mission.missionDetail.status)
        if (this.mission.missionDetail.status === 3) {
          this.mission.missionMessage = this.$store.state.relative.missionInfo.missionMessage
          // this.mission.missionFeedback = this.$store.state.relative.missionInfo.missionFeedback
        }
      },
      // 获取任务公告信息
      async refreshMissionMessage() {
        const messageRes = await this.$axios.get(
          '/api/relation/task_center/task_notices/' + this.$store.state.relative.missionID
        )
        this.$store.commit('relative/updateMissionMessage', messageRes.data.data)
        this.mission.missionMessage = this.$store.state.relative.missionInfo.missionMessage
        this.$Bus.$emit('openSnackbar', {
          text: `任务公告信息刷新完毕。`,
        })
      },
      // 获取任务反馈
      async getMissionFeedback() {
        const feedbackRes = await this.$axios.get(
          '/api/relation/task_center/task_clues/' + this.$store.state.relative.missionID
        )
        this.$store.commit('relative/updateMissionFeedback', feedbackRes.data.data)
        this.mission.missionFeedback = this.$store.state.relative.missionInfo.missionFeedback
      },
      async showMissionFeedback() {
        if (this.mission.missionFeedback.length === 0) {
          await this.getMissionFeedback()
        }
        this.dialog2 = true
      },
      async refreshMissionFeedback() {
        await this.getMissionFeedback()
        this.$Bus.$emit('openSnackbar', {
          text: `搜救反馈信息刷新完毕。`,
        })
      },
      // 获取疑似老人
      async getUncertainOld() {
        const feedbackRes = await this.$axios.get(
          '/api/relation/task_center/uncertain_old/' + this.$store.state.relative.missionID
        )
        this.$store.commit('relative/updateUncertainOld', feedbackRes.data.data)
        this.mission.uncertainOld = this.$store.state.relative.missionInfo.uncertainOld
      },
      async showUncertainOld() {
        if (this.mission.uncertainOld.length === 0) {
          await this.getUncertainOld()
        }
        this.dialog3 = true
      },
      async refreshUncertainOld() {
        await this.getUncertainOld()
        this.$Bus.$emit('openSnackbar', {
          text: `疑似老人信息刷新完毕。`,
        })
      },

      switchPhotoView() {
        // 切换大小图模式
        if (this.carouselHeight === '40vh') {
          this.carouselHeight = '100%'
        } else {
          this.carouselHeight = '40vh'
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  .feedback-title {
    font-size: 20px;
  }

  .feedback-subtitle {
    font-size: 14px;
  }

  .feedback-content {
    font-size: 16px;
  }

  .uncertain-content {
    font-size: 18px;
  }
</style>
