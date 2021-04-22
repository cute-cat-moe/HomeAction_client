<template>
  <div>
    <v-container>
      <div v-if="loading">
        <v-row class="mission-empty-page">
          <v-col cols="12" align-self="center" align="center">
            <Loading v-model="loading" text="正在加载救援任务信息" />
          </v-col>
        </v-row>
      </div>
      <div v-else>
        <Mission v-if="haveMission" />
        <div v-else>
          <v-row class="mission-empty-page">
            <v-col cols="12" align-self="center" align="center">
              <EmptyStatus
                icon="mdi-city-variant-outline"
                text="您当前没有进行中的救援任务"
                button-text="接取任务"
                color="primaryMission"
                @confirm="toConvenerRouter()"
              />
            </v-col>
          </v-row>
        </div>
      </div>
    </v-container>
  </div>
</template>

<script>
import Loading from '~/components/modal/Loading'
import Mission from '~/components/mission/Mission'
import EmptyStatus from '~/components/modal/EmptyStatus'

export default {
  components: { Loading, Mission, EmptyStatus },
  layout: 'volunteer',
  data: () => ({
    loading: true,
    haveMission: false,
  }),
  // TODO: 获取当前志愿者是否参加任务
  // 如果已参加，则展示 Mission 组件
  // 如果无任务或任务已结束，则展示空状态
  created() {
    this.haveMission = true
    this.loading = false
  },
  methods: {
    toConvenerRouter() {
      this.$Bus.$emit('setVolunteerRouter', {
        routerIndex: 2,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.mission-empty-page {
  height: calc(100vh - 56px);
}
</style>
