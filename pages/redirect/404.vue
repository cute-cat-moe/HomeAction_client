<template>
  <div class="con">
    <v-alert type="warning">
      <span class="title-one">
      404,
      </span>
      <span class="title-two">
        您访问的页面找不回来了，但我们可以一起帮他们回家！欢迎加入归家行动！
      </span>
    </v-alert>

    <v-container>
      <v-row>
        <v-spacer></v-spacer>
        <v-card class="card" outlined>
          <v-row>
            <v-col cols="3">
              <v-img
                class="image"
                :src="base_url+old.photo"
                aspect-ratio="1"
                @click="switchPhotoView"
              ></v-img>
            </v-col>
            <v-col cols="9">
              <v-img :src="logo" height="180px"></v-img>
            </v-col>
          </v-row>
          <v-card-title>
<!--            走失老人信息-->
            <v-spacer/>
            <v-btn color="relativeColor" class="mx-2 white--text" @click="">
              点击进入归家行动
            </v-btn>
            <v-btn color="green" class="mx-2 white--text" @click="">
              分享
            </v-btn>
          </v-card-title>

          <v-card-text style="color: #212121">
            <v-row>
              <v-col cols="2">
                <span class="detailDesCSS">姓名</span>
                <v-spacer />
                <span class="detailValueCSS">{{ old.name }}</span>
              </v-col>
              <v-col cols="2">
                <span class="detailDesCSS">性别</span>
                <v-spacer />
                <span class="detailValueCSS">{{ old.sex }}</span>
              </v-col>
              <v-col cols="2">
                <span class="detailDesCSS">年龄</span>
                <v-spacer />
                <span class="detailValueCSS">{{ old.age }}</span>
              </v-col>
              <v-col cols="3">
                <span class="detailDesCSS">家属姓名</span>
                <v-spacer />
                <span class="detailValueCSS">{{ old.relation_name }}</span>
              </v-col>
              <v-col cols="3">
                <span class="detailDesCSS">家属联系电话</span>
                <v-spacer />
                <span class="detailValueCSS">{{ old.relation_phone }}</span>
              </v-col>

              <v-col cols="12" class="py-1"><v-divider /></v-col>

              <v-col cols="3">
                <span class="detailDesCSS">籍贯</span>
                <v-spacer />
                <span class="detailValueCSS">{{ old.nativePlace }}</span>
              </v-col>
              <v-col cols="5">
                <span class="detailDesCSS">最后目击地点</span>
                <v-spacer />
                <span class="detailValueCSS">{{ old.lost_area }}</span>
              </v-col>
              <v-col cols="4">
                <span class="detailDesCSS">最后目击时间</span>
                <v-spacer />
                <span class="detailValueCSS">{{ old.lostDate + ' ' + old.lostTime }}</span>
              </v-col>

<!--              <v-col cols="12" class="py-2"><v-divider /></v-col>-->
              <v-col cols="3" class="detailDesCSS">特征描述</v-col>
              <v-col cols="9" class="detailValueCSS">【体态特征】 {{
                old.posture
                }}。【衣着特征】 {{
                old.clothing
                }}。【其它特征】 {{
                old.otherChara
                }}</v-col>
            </v-row>
          </v-card-text>
        </v-card>
        <v-spacer></v-spacer>
      </v-row>
    </v-container>

    <v-container style="max-width: 60vw">
      <v-row>
        <v-col
          v-for="lostOldInfo in old_data"
          :key="lostOldInfo.id"
          align="center"
        >
          <v-card
            @click="changeOld(lostOldInfo.id)"
            class="card3"
            elevation="4"
          >
            <v-img :src="base_url+lostOldInfo.old.photo" aspect-ratio="1" class="image" max-height="10vh" max-width="10vh"></v-img>
          </v-card>
          <div class="detailValueCSS black--text">
            {{ lostOldInfo.old.name }}
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
  export default {
    // name: "404",
    data: () => ({
      index: 0,
      logo: '/透明logo-min.png',
      carouselHeight: '20vh',
      detailDesCSS: 'text-body-2 opacity-secondary',
      detailValueCSS: 'text-body-1 font-weight-medium',
      old: {
        tid: 0,
        name: '',
        sex: '',
        age: 0,
        relation_name: '',
        relation_phone: '',
        photo: '',
        lostDate: '',
        lostTime: '',
        lost_area: '',
        lost_position: [],
        lost_time: 0,
        nativePlace: '',
        diseaseHistory: '',
        posture: '',
        clothing: '',
        otherChara: '',
      },
      bg: '/透明logo.png',
      old_data: [],
      base_url: 'http://localhost:3010'
    }),

    async created() {
      // 初始化任务详细信息
      await this.get_404()
      console.log(this.old_data)
      this.old = this.old_data[this.index].old
      console.log(this.old)
    },

    watch: {
      index() {
        this.old = this.old_data[this.index].old
      }
    },

    methods: {
      async get_404() {
        const Response = await this.$axios.get('/api/general/get_404')
        if (Response.data) {
          this.old_data = Response.data.data
        }
      },
      switchPhotoView() {
        // 切换大小图模式
        if (this.carouselHeight === '40vh') {
          this.carouselHeight = '100%'
        } else {
          this.carouselHeight = '40vh'
        }
      },
      changeOld(index) {
        console.log("changeOld"+index)
        this.index = index
      }
    },
  }
</script>

<style scoped>
.title-one {
  font-size: 25px;
  font-weight: bolder;
}
.title-two {
  font-size: 15px;
  font-weight: bold;
}
.card {
  max-width: 60vw;
  border-radius: 20px;
  /*background-color: #f2f2f2;*/
  background: url("../../static/卡片背景.png");
}
.card2 {
  max-height: 30vh;
  background: url("../../static/朦胧.jpg");
}
.card3 {
  max-height: 25vh;
  max-width: 10vh;
  border-radius: 90px;
  background: url("../../static/卡片背景.png");
}
.image {
  border-radius: 90px;
  border-width: 10px;
}
.con {
  background: url("../../static/海报.jpg") 100% / 100%;
  color: #c2c2c2;
}
.py-1 {
  margin-top: -10px;
  margin-bottom: -20px;
}
.detailDesCSS {
  color: #959595;
  font-size: 10px;
}
.detailValueCSS {
  font-size: 12px;
}
</style>
