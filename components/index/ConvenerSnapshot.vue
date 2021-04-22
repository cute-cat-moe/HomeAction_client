<template>
  <!-- 正在召集中的任务的缩影图 -->
  <div>
    <v-card class="rounded-lg" elevation="2">
      <v-img :src="lostOldPhoto" aspect-ratio="1"></v-img>
    </v-card>
    <div class="pt-1 body-2 opacity-primary">
      {{ lostOldName }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    lostOldPhoto: {
      type: String,
      required: true,
      default: '/default-action-photo.png',
    },
    lostOldName: {
      type: String,
      required: true,
      default: '',
    },
  },
}
</script>
