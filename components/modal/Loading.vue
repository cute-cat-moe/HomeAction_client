<template>
  <!-- Loading icon 'chunk' from loading.io: https://loading.io/ -->
  <!-- 样式预设：https://loading.io/asset/467955 -->
  <div v-show="loading">
    <v-img
      src="/loading.gif"
      :height="size"
      :width="size"
      transition="fade-transition"
    ></v-img>
    <v-card-text v-if="text" class="pa-0 pt-1 opacity-secondary">{{
      text
    }}</v-card-text>
  </div>
</template>

<script>
export default {
  model: {
    prop: 'loading',
    event: 'setLoadingStatus',
  },
  props: {
    loading: {
      type: Boolean,
      required: true,
      default: false,
    },
    size: {
      type: Number,
      required: false,
      default: 75,
    },
    text: {
      type: String,
      required: false,
      default: '',
    },
  },
}
</script>
