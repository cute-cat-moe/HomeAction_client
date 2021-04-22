<template>
  <div>
    <AppBar :mode="2" />
    <v-card class="card">
      <v-card-title>
        <v-avatar :color="color" :size="size" class="my-avatar">
          <v-img v-if="memberInfo.avatar" :src="memberInfo.avatar"></v-img>
          <span v-else class="ava-text">{{ memberInfo.name[0] }}</span>
        </v-avatar>

        <v-alert style="background-color: rgba(0, 0, 0, 0)">
          <v-row>
            <span class="title-one">{{ memberInfo.name }}</span>
          </v-row>
          <v-row>
            <span class="title-two">电话：{{ memberInfo.phone }}</span>
          </v-row>
        </v-alert>
        <v-spacer></v-spacer>
        <v-btn class="mx-2" fab small elevation="2" :color="btnColor">
          <v-icon>mdi-cog</v-icon>
        </v-btn>
      </v-card-title>
    </v-card>

    <v-card class="card2">
      <v-card-text>
        <v-divider></v-divider>

        <v-alert class="my-alert">
          <v-row>
            <v-icon>mdi-clipboard-check-multiple-outline</v-icon>
            <span class="title-tr">历史搜救记录</span>
            <v-spacer></v-spacer>
            <v-btn class="mx-2" fab small elevation="0">
              <v-icon>mdi-chevron-right-circle-outline</v-icon>
            </v-btn>
          </v-row>
        </v-alert>
        <v-divider></v-divider>

        <v-alert class="my-alert">
          <v-row>
            <v-icon>mdi-help-rhombus-outline</v-icon>
            <span class="title-tr">帮助反馈</span>
            <v-spacer></v-spacer>
            <v-btn class="mx-2" fab small elevation="0">
              <v-icon>mdi-chevron-right-circle-outline</v-icon>
            </v-btn>
          </v-row>
        </v-alert>
        <v-divider></v-divider>

        <v-alert class="my-alert">
          <v-row>
            <v-icon>mdi-account-outline</v-icon>
            <span class="title-tr">在线客服</span>
            <v-spacer></v-spacer>
            <v-btn class="mx-2" fab small elevation="0">
              <v-icon>mdi-chevron-right-circle-outline</v-icon>
            </v-btn>
          </v-row>
        </v-alert>
        <v-divider></v-divider>

        <v-alert class="my-alert">
          <v-row>
            <v-icon>mdi-location-exit</v-icon>
            <span class="title-tr">退出登录</span>
            <v-spacer></v-spacer>
            <v-btn class="mx-2" fab small elevation="0">
              <v-icon>mdi-chevron-right-circle-outline</v-icon>
            </v-btn>
          </v-row>
        </v-alert>
        <v-divider></v-divider>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import AppBar from '~/components/index/AppBar'
export default {
  components: { AppBar },
  layout: 'relative',
  data: () => ({
    color: '#f2f2f2',
    btnColor: '#eeeeee',
    memberInfo: {
      avatar: null,
      name: '老人家属',
      phone: '123456',
    },
    size: 88,
  }),
}
</script>

<style scoped>
.title-one {
  background-color: rgba(0, 0, 0, 0);
  margin-top: 20px;
  font-size: 30px;
  font-weight: bolder;
  color: #ffc96b;
}
.title-two {
  background-color: rgba(0, 0, 0, 0);
  margin-top: 10px;
  font-size: 20px;
  font-weight: bold;
  color: #787878;
}
.title-tr {
  margin-top: 10px;
  margin-left: 20px;
  font-size: 20px;
  font-weight: bold;
  color: #787878;
}
.my-avatar {
  margin-right: 20px;
}
.my-alert {
  border-radius: 2px;
  color: #e3e3e3;
}
.ava-text {
  font-weight: bolder;
  font-size: 40px;
  color: #787878;
}
.card {
  margin: 10px 10px;
  border-radius: 10px;
  /*background: url("../../static/朦胧.jpg");*/
  /*background-color: #f2f2f2;*/
  background: url('../../static/卡片背景.png');
}
.card2 {
  margin-top: 20px;
  margin-left: 10px;
  margin-right: 10px;
  /*background: url("../../static/朦胧.jpg");*/
}
.card3 {
  max-height: 25vh;
  max-width: 10vh;
  border-radius: 90px;
  background: url('../../static/卡片背景.png');
}
.con {
  background: url('../../static/海报.jpg');
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
