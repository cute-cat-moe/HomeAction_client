<template>
  <!-- 打开任务地图按钮 -->
  <v-fab-transition>
    <v-btn
      fixed
      fab
      dark
      bottom
      left
      color="white"
      elevation="2"
      class="mb-12"
      @click="$emit('openMissionMap')"
    >
      <v-icon color="primaryMission">mdi-map</v-icon>
    </v-btn>
  </v-fab-transition>
</template>

<script>
export default {
  props: {},
  data: () => ({
    //
  }),
}
</script>
