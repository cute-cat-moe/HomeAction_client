<template>
  <!-- 新闻信息页面 -->
  <v-dialog
    v-model="newsDetailDialog"
    fullscreen
    hide-overlay
    persistent
    no-click-animation
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-toolbar
        class="dialog-toolbar"
        dark
        :color="$ValueHandler.getColorFromNewsType(news.type)"
        width="100%"
      >
        <v-btn icon dark @click="newsDetailDialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title class="px-3">{{
          $ValueHandler.getTextFromNewsType(news.type)
        }}</v-toolbar-title>
      </v-toolbar>
      <div class="py-14 px-3">
        <v-card-title class="news-title pb-1">{{ news.title }}</v-card-title>
        <v-divider class="mx-2" />
        <v-card-subtitle class="news-subtitle pt-1">
          {{ $Dayjs.formatDateTime(news.date, 'YYYY-MM-DD HH:mm')
          }}{{ news.location ? `，${news.location}` : '' }}
        </v-card-subtitle>
        <v-card-text class="news-content">
          <MarkdownIt v-model="news.content" loading-text="正在载入新闻中" />
        </v-card-text>
      </div>
      <v-toolbar class="dialog-bottom-toolbar" width="100%" elevation="1">
        <v-spacer />
        <v-toolbar-items
          ><v-btn depressed block @click="newsDetailDialog = false"
            >关闭窗口</v-btn
          ></v-toolbar-items
        >
      </v-toolbar>
    </v-card>
  </v-dialog>
</template>

<script>
import MarkdownIt from '~/components/modal/MarkdownIt'

export default {
  components: { MarkdownIt },
  data: () => ({
    newsDetailDialog: false,
    news: {
      type: 'news',
      photo: '/default-news-photo.png',
      title: '',
      content: '',
      date: 0,
      location: '',
    },
  }),
  mounted() {
    this.$Bus.$on('openNewsDetailDialog', (msg) => {
      this.news = msg
      this.newsDetailDialog = true
    })
  },
}
</script>

<style lang="scss" scoped>
.news-title {
  font-size: 20px;
}

.news-subtitle {
  font-size: 14px;
}

.news-content {
  font-size: 16px;
}
</style>
