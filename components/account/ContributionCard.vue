<template>
  <!-- 账户贡献卡片 -->
  <div>
    <v-card
      class="mx-auto rounded-lg pa-4"
      max-width="700"
      width="80vw"
      outlined
      elevation="1"
    >
      <v-row no-gutters>
        <v-col cols="6" align-self="center" align="center">
          <div :class="titleClass">志愿时长</div>
          <div :class="valueClass">{{ contribution.v_time }} 小时</div>
        </v-col>
        <v-col cols="6" align-self="center" align="center">
          <div :class="titleClass">任务参与数</div>
          <div :class="valueClass">{{ contribution.task_num }}</div>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    contribution: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    titleClass: 'text-subtitle-1 opacity-secondary',
    valueClass: 'text-h6 opacity-primary pt-1',
  }),
}
</script>
