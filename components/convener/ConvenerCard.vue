<template>
  <!-- 救援召集页面任务卡片 -->
  <v-card class="rounded-lg" outlined elevation="1">
    <v-row no-gutters>
      <v-col cols="4" align-self="center">
        <v-img
          :src="mission.lostOldDetail.mainPhoto.path"
          class="ma-2 rounded-lg"
          aspect-ratio="1"
          max-height="20vh"
        ></v-img>
      </v-col>
      <v-col cols="8" align-self="center">
        <v-card-title class="pa-2 pb-1">
          <v-chip
            class="mr-2 mb-1"
            :color="colorStatus"
            label
            text-color="white"
            small
          >
            <v-icon left small>mdi-label</v-icon>
            {{
              $ValueHandler.getMissionStatusFromValue(
                mission.missionDetail.status
              )
            }}{{ labelComment }}
          </v-chip>
          <!-- 进行中和召集中的任务显示任务等级标签 -->
          <v-chip
            v-if="
              mission.missionDetail.status === 1 ||
              mission.missionDetail.status === 2
            "
            class="mr-2 mb-1"
            :color="colorLevel"
            label
            text-color="white"
            small
          >
            <v-icon left small>mdi-android-auto</v-icon>
            {{
              $ValueHandler.getMissionLevelFromValue(
                mission.missionDetail.level
              )
            }}
          </v-chip>
        </v-card-title>
        <v-card-title class="pa-2 pt-0 opacity-primary"
          ><span class="ellipsis-two">{{
            `${mission.lostOldDetail.name}，${mission.lostOldDetail.gender}，${mission.lostOldDetail.age} 岁`
          }}</span></v-card-title
        >
        <v-card-actions>
          <v-row>
            <v-col align="start">
              <div class="opacity-secondary">
                {{
                  $Dayjs.formatDateTime(
                    mission.missionDetail.startTime,
                    'YY-MM-DD HH:mm'
                  )
                }}
              </div>
              <div class="opacity-secondary">
                距您 {{ mission.missionDetail.distance }}
              </div>
            </v-col>
            <v-col align="end" align-self="end">
              <v-btn depressed @click="openConvenerDetailDialog(mission)"
                >查看详情</v-btn
              >
            </v-col>
          </v-row>
        </v-card-actions>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
export default {
  components: {},
  props: {
    mission: {
      type: Object,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
  },
  computed: {
    // 根据任务状态获取任务状态标签颜色
    colorStatus() {
      return this.$ValueHandler.getColorFromMissionStatusValue(
        this.mission.missionDetail.status
      )
    },
    // 根据任务等级获取任务等级标签颜色
    colorLevel() {
      return this.$ValueHandler.getColorFromMissionLevelValue(
        this.mission.missionDetail.level
      )
    },
    // 任务状态为召集中或进行中时，显示召集的人数
    labelComment() {
      return [1, 2].includes(this.mission.missionDetail.status)
        ? `(${this.mission.missionDetail.called}人)`
        : ''
    },
  },
  methods: {
    openConvenerDetailDialog(mission) {
      this.$Bus.$emit('openConvenerDetailDialog', {
        mission,
      })
    },
  },
}
</script>
