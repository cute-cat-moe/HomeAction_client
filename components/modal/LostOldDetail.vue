<template>
  <!-- 走失老人详细信息模板 -->
  <div>
    <v-card class="rounded-lg" outlined>
      <v-carousel
        :cycle="carouselCycle"
        :height="carouselHeight"
        hide-delimiter-background
        show-arrows-on-hover
      >
        <v-carousel-item v-for="photo in photos" :key="photo.path">
          <v-img
            :src="baseUrl + photo.path"
            :height="carouselHeight"
            @click="switchPhotoView"
          ></v-img>
        </v-carousel-item>
      </v-carousel>
    </v-card>

    <v-card-text style="color: #212121">
      <v-row>
        <v-col cols="4">
          <span :class="detailDesCSS">姓名</span>
          <v-spacer />
          <span :class="detailValueCSS">{{ lostOldDetail.name }}</span>
        </v-col>
        <v-col cols="4">
          <span :class="detailDesCSS">性别</span>
          <v-spacer />
          <span :class="detailValueCSS">{{ lostOldDetail.gender }}</span>
        </v-col>
        <v-col cols="4">
          <span :class="detailDesCSS">年龄</span>
          <v-spacer />
          <span :class="detailValueCSS">{{ lostOldDetail.age }}</span>
        </v-col>

        <v-col cols="12" class="py-2"><v-divider /></v-col>

        <v-col cols="3" :class="detailDesCSS">老人走失地点</v-col>
        <v-col cols="9" :class="detailValueCSS">{{
          lostOldDetail.lastKnownLocation.name
        }}</v-col>
        <v-col cols="3" :class="detailDesCSS">最后目击时间</v-col>
        <v-col cols="9" :class="detailValueCSS">{{
          lostOldDetail.lostDate + ' ' + lostOldDetail.lostTime
        }}</v-col>
        <v-col cols="3" :class="detailDesCSS">老人常去地点</v-col>
        <v-col cols="9" :class="detailValueCSS">
          <v-chip
            v-for="location in lostOldDetail.starLocation"
            :key="location.name"
            class="mr-1 mb-1"
          >
            {{ location.name }}
          </v-chip>
        </v-col>

        <v-col cols="12" class="py-2"><v-divider /></v-col>

        <v-col cols="3" :class="detailDesCSS">籍贯</v-col>
        <v-col cols="9" :class="detailValueCSS">{{
          lostOldDetail.nativePlace
        }}</v-col>
        <v-col cols="3" :class="detailDesCSS">疾病史</v-col>
        <v-col cols="9" :class="detailValueCSS">{{
          lostOldDetail.diseaseHistory
        }}</v-col>
        <v-col cols="3" :class="detailDesCSS">体态特征</v-col>
        <v-col cols="9" :class="detailValueCSS">{{
          lostOldDetail.posture
        }}</v-col>
        <v-col cols="3" :class="detailDesCSS">衣着特征</v-col>
        <v-col cols="9" :class="detailValueCSS">{{
          lostOldDetail.clothing
        }}</v-col>
        <v-col cols="3" :class="detailDesCSS">其它特征</v-col>
        <v-col cols="9" :class="detailValueCSS">{{
          lostOldDetail.otherChara
        }}</v-col>
        <v-col cols="3" :class="detailDesCSS">信息补充</v-col>
        <v-col cols="9" :class="detailValueCSS">{{
          lostOldDetail.otherInfo
        }}</v-col>

        <v-col cols="12" class="py-2"><v-divider /></v-col>

        <v-col cols="4">
          <span :class="detailDesCSS">家属姓名</span>
          <v-spacer />
          <span :class="detailValueCSS">{{ lostOldDetail.relative.name }}</span>
        </v-col>
        <v-col cols="8">
          <span :class="detailDesCSS">家属联系电话</span>
          <v-spacer />
          <span :class="detailValueCSS">{{
            lostOldDetail.relative.telephone
          }}</span>
        </v-col>
      </v-row>
    </v-card-text>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    lostOldDetail: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    carouselHeight: '40vh',
    detailDesCSS: 'text-body-2 opacity-secondary',
    detailValueCSS: 'text-body-1 font-weight-medium',
    baseUrl: process.env.HOME_ACTION_BACKEND_URL,
  }),
  computed: {
    carouselCycle() {
      // 小图模式自动切换照片
      switch (this.carouselHeight) {
        case '40vh':
          return true
        default:
          return false
      }
    },
    // 合并 lostOldDetail 中的 mainPhoto 和 additionalPhoto
    photos() {
      return [
        this.lostOldDetail.mainPhoto,
        ...this.lostOldDetail.additionalPhoto,
      ]
    },
  },
  methods: {
    switchPhotoView() {
      // 切换大小图模式
      if (this.carouselHeight === '40vh') {
        this.carouselHeight = '100%'
      } else {
        this.carouselHeight = '40vh'
      }
    },
  },
}
</script>
