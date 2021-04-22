<template>
  <!-- 搜索任务页面 -->
  <div>
    <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      persistent
      no-click-animation
      transition="dialog-bottom-transition"
    >
      <v-card></v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  model: {
    prop: 'missionSearchDialog',
    event: 'onOpenCloseMissionSearchDialog',
  },
  props: {
    missionSearchDialog: {
      type: Boolean,
      required: true,
    },
  },
  data: () => ({
    dialog: false,
  }),
  watch: {
    missionSearchDialog(newVal) {
      this.dialog = newVal
    },
    dialog(newVal) {
      this.$emit('onOpenCloseMissionSearchDialog', newVal)
    },
  },
  created() {
    this.dialog = this.missionSearchDialog
  },
}
</script>
