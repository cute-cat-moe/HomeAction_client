<template>
  <!-- 主页上方的主视觉图 -->
  <div>
    <v-card outlined class="rounded-lg" elevation="1">
      <v-carousel
        cycle
        height="40vh"
        hide-delimiter-background
        show-arrows-on-hover
      >
        <v-carousel-item v-for="item in news" :key="item.nid">
          <v-img :src="item.photo || '/default-news-photo.png'" height="40vh" />
        </v-carousel-item>
      </v-carousel>
      <v-divider />
      <v-card-text>
        <v-row>
          <v-col cols="6" align="center">
            <span>注册志愿者数</span>
            <v-spacer />
            <span class="text-content-primary text-h6">
              {{ actionStatistics.volunteerNum }}
            </span>
          </v-col>
          <v-col cols="6" align="center">
            <span>救援任务总数</span>
            <v-spacer />
            <span class="text-content-primary text-h6">
              {{ actionStatistics.actionCount }}
            </span>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    news: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    photos: [
      {
        id: 0,
        path: '/volunteer-1.jpg',
      },
      {
        id: 1,
        path: '/volunteer-2.jpg',
      },
      {
        id: 2,
        path: '/volunteer-3.jpg',
      },
    ],
    actionStatistics: {
      volunteerNum: 201809,
      actionCount: 1202,
    },
  }),
  created() {
    // TODO: 获取行动统计
  },
}
</script>
