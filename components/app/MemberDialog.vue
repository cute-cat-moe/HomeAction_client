<template>
  <!-- 志愿者信息模板 -->
  <v-dialog v-model="dialog" max-width="400">
    <v-card class="rounded-lg">
      <v-card-title class="justify-center pb-4 pt-8">
        <MemberAvatar :member-info="memberInfo" :size="avatarSize" />
      </v-card-title>
      <v-card-text class="px-6 py-4" style="color: #212121">
        <v-row>
          <v-col cols="4" :class="desCSS">成员姓名</v-col>
          <v-col cols="8" :class="valueCSS">{{ memberInfo.name }}</v-col>
          <!-- <v-col cols="4" :class="desCSS">个性签名</v-col>
          <v-col cols="8" :class="valueCSS">{{ memberInfo.signature }}</v-col> -->
          <v-col cols="4" :class="desCSS">联系电话</v-col>
          <v-col cols="8" :class="valueCSS">{{ memberInfo.telephone }}</v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="py-4">
        <TelephoneCallButton
          v-show="memberInfo.telephone"
          :telephone="memberInfo.telephone"
        />
        <!-- <WechatContactButton
          v-show="memberInfo.wechat"
          :wechat="memberInfo.wechat"
        /> -->
        <v-spacer />
        <v-btn depressed @click="dialog = false">关闭</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import MemberAvatar from '~/components/modal/MemberAvatar'
import TelephoneCallButton from '~/components/button/TelephoneCallButton'
// import WechatContactButton from '~/components/button/WechatContactButton'

export default {
  components: { MemberAvatar, TelephoneCallButton },
  data: () => ({
    dialog: false,
    avatarSize: 64,
    memberInfo: {
      uid: '',
      name: '',
      avatar: '',
      // signature: '',
      telephone: '',
      wechat: '',
    },
    desCSS: 'text-body-2 opacity-secondary',
    valueCSS: 'text-body-1 font-weight-medium',
  }),
  mounted() {
    this.$Bus.$on('openMemberDialog', (msg) => {
      this.memberInfo = msg
      this.dialog = true
    })
  },
}
</script>
