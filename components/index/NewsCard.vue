<template>
  <!-- 新闻卡片模板 -->
  <v-card
    class="rounded-lg"
    outlined
    elevation="1"
    @click.native="openDetail()"
  >
    <v-row no-gutters>
      <v-col cols="4" align-self="center">
        <v-img
          :src="photo"
          class="ma-2 rounded-lg"
          aspect-ratio="1"
          max-height="300"
        ></v-img>
      </v-col>
      <v-col cols="8" align-self="center">
        <v-card-title class="pa-2 pb-1">
          <v-chip
            class="mb-1"
            :color="$ValueHandler.getColorFromNewsType(type)"
            dark
            label
            small
          >
            {{ $ValueHandler.getTextFromNewsType(type) }}
          </v-chip>
        </v-card-title>
        <v-card-title class="pa-2 py-0 opacity-primary">
          <span class="ellipsis-one">{{ title }}</span>
        </v-card-title>
        <v-card-text class="pa-2 pt-0 opacity-primary">
          <span class="ellipsis-two">{{ content }}</span>
        </v-card-text>
        <v-card-actions>
          <v-row class="opacity-secondary">
            <v-col cols="6">
              {{ $Dayjs.formatDateTime(date, 'YYYY-MM-DD') }}
            </v-col>
            <v-col cols="6">
              {{ location }}
            </v-col>
          </v-row>
        </v-card-actions>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
export default {
  props: {
    // 新闻的类型
    // news 即动态要闻，默认为此类型
    // rescue 即救援风采
    // platform 即平台公告
    type: {
      type: String,
      required: false,
      default: 'news',
      validator: (v) => {
        return ['news', 'rescue', 'platform'].includes(v)
      },
    },
    // 新闻的封面照片
    photo: {
      type: String,
      required: false,
      default: '/default-news-photo.png',
    },
    // 新闻的标题，将显示一行
    title: {
      type: String,
      required: true,
      default: '',
    },
    // 新闻的内容，将显示两行
    content: {
      type: String,
      required: true,
      default: '',
    },
    // 新闻的日期，传入时间戳
    date: {
      type: Number,
      required: true,
      default: 0,
    },
    // 新闻的关联地址
    location: {
      type: String,
      required: false,
      default: '',
    },
  },
  methods: {
    openDetail() {
      this.$Bus.$emit('openNewsDetailDialog', {
        type: this.type,
        photo: this.photo,
        title: this.title,
        content: this.content,
        date: this.date,
        location: this.location,
      })
    },
  },
}
</script>
