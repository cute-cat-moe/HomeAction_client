<template>
  <div>
    <v-container>
      <v-app-bar color="primaryConvener" app dark dense fixed>
        <v-app-bar-title
          ><v-icon dense left>mdi-file-document-multiple</v-icon
          >任务列表</v-app-bar-title
        >
        <v-spacer />
        <v-btn icon><v-icon>mdi-magnify</v-icon></v-btn>
        <template #extension>
          <v-row align="center" no-gutters>
            <v-col cols="4">
              <v-select
                v-model="filterStatus"
                :items="itemsStatus"
                label="状态"
                dense
                outlined
                hide-details
                item-color="primaryConvener"
                :disabled="loading"
              ></v-select>
            </v-col>
            <v-col cols="4">
              <v-select
                v-model="filterLevel"
                :items="itemsLevel"
                label="等级"
                dense
                outlined
                hide-details
                item-color="primaryConvener"
                :disabled="loading"
              ></v-select>
            </v-col>
            <v-col cols="4">
              <v-select
                v-model="filterDistance"
                :items="itemsDistance"
                label="距离"
                dense
                outlined
                hide-details
                item-color="primaryConvener"
                :disabled="loading"
              ></v-select>
            </v-col>
          </v-row>
        </template>
      </v-app-bar>

      <ConvenerStatus
        v-model="showAlert"
        alert-text="您已有正在进行中的志愿任务，无法再接取更多任务"
        action-text="查看任务"
        @action="switchToMissionRouter"
      />

      <!-- 任务卡片 -->
      <div v-if="missions && missions.length !== 0">
        <div
          v-for="mission in missions"
          :key="mission.missionDetail.missionId"
          class="mb-4"
        >
          <ConvenerCard :mission="mission" :role="role" />
        </div>
      </div>
      <!-- 空状态 -->
      <div v-else>
        <v-row class="convener-empty-page">
          <v-col cols="12" align-self="center" align="center">
            <EmptyStatus
              icon="mdi-city-variant-outline"
              text="未检索到任务信息"
              :hide-button="
                itemsStatus === '所有任务' &&
                itemsLevel === '所有等级' &&
                itemsDistance === '所有距离'
              "
              button-text="关闭过滤"
              color="primaryConvener"
              @confirm="closeFilters()"
            />
          </v-col>
        </v-row>
      </div>
    </v-container>
  </div>
</template>

<script>
import ConvenerCard from '~/components/convener/ConvenerCard'
import ConvenerStatus from '~/components/modal/Status'
import EmptyStatus from '~/components/modal/EmptyStatus'

export default {
  components: { ConvenerCard, ConvenerStatus, EmptyStatus },
  layout: 'volunteer',
  data: () => ({
    // 当志愿者有正在进行中的任务时，显示此提醒
    showAlert: false,
    // 当正在加载任务信息时，设置加载状态
    loading: false,
    // 任务状态过滤
    filterStatus: '进行中',
    // 任务等级过滤
    filterLevel: '所有等级',
    itemsLevel: ['所有等级', '一级', '二级', '三级'],
    // 任务中心距离过滤
    filterDistance: '所有距离',
    itemsDistance: ['所有距离', '10 km', '20 km', '30 km'],
    // 救援召集界面显示的任务信息
    missions: [],
    // 救援召集界面获取所有任务信息
    // 根据过滤的值将此处的任务放到 missions 数组中
    // 此处获取的任务为简略信息，应包括两个部分
    // 1: missionDetail 任务的全局信息
    // 2: lostOldDetail 走失老人的信息
    queryMissions: [],
    // 单次查询任务的数量上限
    queryLimit: 10,
    // 志愿者身份
    role: '',
  }),
  computed: {
    itemsStatus() {
      switch (this.role) {
        case 'volunteer':
          return ['所有任务', '召集中', '进行中', '已结束']
        case 'leader':
          return ['所有任务', '已拒绝', '待审核', '召集中', '进行中', '已结束']
        default:
          return []
      }
    },
  },
  watch: {
    // 当 filterStatus 改变时重新获取任务信息
    filterStatus() {
      this.filterLevel = '所有等级'
      this.filterDistance = '所有距离'
      this.getConvenerMissions()
    },
  },
  created() {
    this.role = localStorage.volunteerRole
    this.getConvenerMissions()
  },
  methods: {
    // TODO: 根据 filterStatus 获取任务
    // 然后在前端计算 mission.missionMapDetail 中走失老人坐标和当前志愿者的距离
    // 根据 filterLevel 和 filterDistance 展示任务信息
    getConvenerMissions() {
      this.loading = true
      this.missions = [
        {
          missionDetail: {
            missionId: '123',
            status: 1,
            need: 40,
            called: 12,
            level: 1,
            startTime: new Date().getTime() - 100000,
            distance: '12 km',
            principalName: '张三',
            principalPhone: '123456',
          },
          lostOldDetail: {
            relative: {
              id: new Date().getTime(),
              name: '吴先生',
              telephone: '18980340000',
            },
            mainPhoto: {
              id: 0,
              path: '/old-woman.jpg',
            },
            additionalPhoto: [
              {
                id: 1,
                path: '/old-man.jpg',
              },
            ],
            name: '周直臻',
            gender: '男',
            age: '89',
            lastKnownLocation: {
              name: 'XXXXXXXXXXXXXXXXXXXXX',
              lnglat: ['234', '236'],
            },
            starLocation: [
              {
                name: 'XXXXXXXXXXXXXXXXXXXXX',
                lnglat: ['123', '15346'],
              },
              {
                name: 'XXXXXXXXXXXXXXXXXXXXX',
                lnglat: ['315', '1325234'],
              },
            ],
            lostDate: '2021-04-04',
            lostTime: '16:26',
            nativePlace: '四川省成都市',
            diseaseHistory: '心脏病',
            posture: '身高180cm左右，体重70kg',
            clothing: '带着绿色的帽子，穿红色的衣服，蓝色牛仔裤，拖鞋',
            otherChara: '长得比较瓜，手上有胎记',
            otherInfo: '可能会偷偷跑去酒吧',
          },
        },
        {
          missionDetail: {
            missionId: '122',
            status: 0,
            need: 40,
            called: 12,
            level: 1,
            startTime: new Date().getTime() - 100000,
            distance: '12 km',
            principalName: '张三',
            principalPhone: '123456',
          },
          lostOldDetail: {
            relative: {
              id: new Date().getTime(),
              name: '吴先生',
              telephone: '18980340000',
            },
            mainPhoto: {
              id: 0,
              path: '/old-woman.jpg',
            },
            additionalPhoto: [
              {
                id: 1,
                path: '/old-man.jpg',
              },
            ],
            name: '周直臻',
            gender: '男',
            age: '89',
            lastKnownLocation: {
              name: 'XXXXXXXXXXXXXXXXXXXXX',
              lnglat: ['234', '236'],
            },
            starLocation: [
              {
                name: 'XXXXXXXXXXXXXXXXXXXXX',
                lnglat: ['123', '15346'],
              },
              {
                name: 'XXXXXXXXXXXXXXXXXXXXX',
                lnglat: ['315', '1325234'],
              },
            ],
            lostDate: '2021-04-04',
            lostTime: '16:26',
            nativePlace: '四川省成都市',
            diseaseHistory: '心脏病',
            posture: '身高180cm左右，体重70kg',
            clothing: '带着绿色的帽子，穿红色的衣服，蓝色牛仔裤，拖鞋',
            otherChara: '长得比较瓜，手上有胎记',
            otherInfo: '可能会偷偷跑去酒吧',
          },
        },
        {
          missionDetail: {
            missionId: '121',
            status: -1,
            need: 40,
            called: 12,
            level: 1,
            startTime: new Date().getTime() - 100000,
            distance: '12 km',
            principalName: '张三',
            principalPhone: '123456',
          },
          lostOldDetail: {
            relative: {
              id: new Date().getTime(),
              name: '吴先生',
              telephone: '18980340000',
            },
            mainPhoto: {
              id: 0,
              path: '/old-woman.jpg',
            },
            additionalPhoto: [
              {
                id: 1,
                path: '/old-man.jpg',
              },
            ],
            name: '周直臻',
            gender: '男',
            age: '89',
            lastKnownLocation: {
              name: 'XXXXXXXXXXXXXXXXXXXXX',
              lnglat: ['234', '236'],
            },
            starLocation: [
              {
                name: 'XXXXXXXXXXXXXXXXXXXXX',
                lnglat: ['123', '15346'],
              },
              {
                name: 'XXXXXXXXXXXXXXXXXXXXX',
                lnglat: ['315', '1325234'],
              },
            ],
            lostDate: '2021-04-04',
            lostTime: '16:26',
            nativePlace: '四川省成都市',
            diseaseHistory: '心脏病',
            posture: '身高180cm左右，体重70kg',
            clothing: '带着绿色的帽子，穿红色的衣服，蓝色牛仔裤，拖鞋',
            otherChara: '长得比较瓜，手上有胎记',
            otherInfo: '可能会偷偷跑去酒吧',
          },
        },
      ]
      this.loading = false
    },
    // 跳转到任务信息路由
    switchToMissionRouter() {
      this.$Bus.$emit('setVolunteerRouter', {
        routerIndex: 1,
      })
    },
    // 重置过滤器为默认值
    refreshFilters() {
      this.filterStatus = '进行中'
      this.filterLevel = '所有等级'
      this.filterDistance = '所有距离'
    },
    // 设置过滤器为全部任务
    closeFilters() {
      this.filterStatus = '所有任务'
      this.filterLevel = '所有等级'
      this.filterDistance = '所有距离'
    },
  },
}
</script>

<style lang="scss" scoped>
.convener-empty-page {
  height: calc(100vh - 152px);
}
</style>
