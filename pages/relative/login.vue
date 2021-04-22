<template>
  <div>
    <!--    <a href="/login">返回</a>-->
    <!--    <a href="/relative/">老人家属</a>-->
    <!--    <a href="/redirect/404">404</a>-->
    <v-card class="card">
      <v-img
        :src='bg'
        gradient="to bottom, rgba(0,0,0,.05), rgba(0,0,0,.08)"
        height="200px"
        @click="get404"
      >
      </v-img>
      <v-card-title>
        <v-chip
          label
          color="relativeColor"
          text-color="white"
        >
          <span class="t1">归家行动</span>
          <span class="body-1 opacity-primary">——老人家属登录</span>
        </v-chip>
      </v-card-title>

      <v-card-text style="margin-top: 30px">
        <v-row no-gutters>
          <!-- 登录电话 -->
          <v-text-field
            v-model="phone"
            :rules="telephoneRules"
            label="电话"
            prepend-icon="mdi-phone"
            counter="11"
            filled
            hint="请输入电话"
            :background-color="editColor"
          ></v-text-field>
        </v-row>
        <v-row no-gutters>
          <!-- 登录密码 -->
          <v-text-field
            v-model="password"
            :rules="[passwordRules.required, passwordRules.min]"
            :type="show1 ? 'text' : 'password'"
            prepend-icon="mdi-lock"
            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="show1 = !show1"
            filled
            hint="请输入登录密码"
            :background-color="editColor"
            label="登录密码"
          >
          </v-text-field>
        </v-row>
        <v-row>
          <v-spacer></v-spacer>
          <v-checkbox
            color='#a9a9a9'
            label="记住密码"
            v-model="checkbox"
          ></v-checkbox>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="relativeColor" class="mx-2 white--text" @click="login">
          登录
        </v-btn>
        <v-btn color="#a8a8a8" class="mx-2 white--text" @click="getin">
          取消
        </v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
  export default {
    data: () => ({
      bg: '/透明logo.png',
      phone: '',
      password: '',
      checkbox: false,
      show1: false,
      passwordRules: {
        required: value => !!value || '您需要输入登录密码',
        min: v => v.length >= 6 || '密码至少为6位',
      },
      editColor: 'rgba(255,255,255,0.72)',
      eColor: '#a8a8a8',
      telephoneRules: [
        (v) => !!v || '您需要输入电话',
        (v) => (v && v.length <= 11) || '您需要输入正确的联系电话',
      ],
    }),
    created() {
      // // this.createPersistedState
      this.phone = localStorage.phone
      let c = localStorage.checkbox
      console.log('created：'+c)
      if (c) {
        console.log('check：'+c)
        this.checkbox = c
        console.log('当前check：'+this.checkbox)
        this.password = localStorage.password
      }
      // // 记住密码
      // this.$store.state.relative.phone = localStorage.phone || ''
      // this.$store.state.relative.password = localStorage.password || ''
    },
    watch: {
      checkbox(curVal, oldVal) {
        console.log('check:'+curVal)
        // 不记住密码
        if (!curVal) {
          // this.phone = ''
          localStorage.checkbox = false
          this.password = ''
          localStorage.password = ''
        } else {
          localStorage.checkbox = true
        }
      }
    },
    components: {},
    layout: 'default',
    methods: {
      getin() {
        this.$router.replace({
          path: '/relative/',
        })
      },
      get404() {
        this.$router.replace({
          path: '/redirect/404',
        })
      },
      async login() {
        console.log('login:'+this.checkbox)
        localStorage.checkbox = this.checkbox
        localStorage.phone = this.phone
        localStorage.password = this.password
        const postData = {
          rid: this.$store.state.relative.rid,
          phone: this.phone,
          password: this.password,
        }
        const Response = await this.$axios.post(
          '/api/relation/user/login',
          postData
        )

        if (Response.data) {
          console.log(Response.data)
          const value = {
            token: Response.data.data.token,
            missionID: Response.data.data.missionID,
            rid: Response.data.data.rid,
          }
          console.log(value)
          this.$store.commit('relative/updateLogin', value)
          // missionID不为0，表示当前有任务，接着获取任务的详细数据
          if (Response.data.data.missionID !== 0) {
            const missionRes = await this.$axios.get(
              '/api/relation/task_center/' + Response.data.data.missionID
            )
            this.$store.commit('relative/updateMissionInfo', missionRes.data.data)
            console.log(
              this.$store.state.relative.missionInfo.missionDetail.status
            )
            // status为3时，表示任务进行中，接着获取任务的公告数据和反馈数据
            if (this.$store.state.relative.missionInfo.missionDetail.status === 3) {
              const messageRes = await this.$axios.get(
                '/api/relation/task_center/task_notices/' + Response.data.data.missionID
              )
              this.$store.commit('relative/updateMissionMessage', messageRes.data.data)
              // const feedbackRes = await this.$axios.get(
              //   '/api/relation/task_center/task_clues/' + Response.data.data.missionID
              // )
              // this.$store.commit('relative/updateMissionFeedback', feedbackRes.data.data)
              console.log(
                this.$store.state.relative.missionInfo.missionMessage
              )
            }
          }
          await this.$router.replace({
            path: '/relative/',
          })
        } else {
          const value = {
            token: '',
            missionID: 0,
            rid: 0,
          }
          this.$store.commit('relative/updateLogin', value)
        }
      },
    },
  }
</script>

<style>
  .card {
    margin-left: 20px;
    margin-right: 20px;
    margin-top: 20px;
    /*background-color: #f2f2f2;*/
    background: url("../../static/卡片背景.png");
  }
  .t1 {
    font-weight: bolder;
    font-size: 20px;
  }
</style>
