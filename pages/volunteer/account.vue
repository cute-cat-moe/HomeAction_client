<template>
  <div>
    <v-toolbar color="primaryAccount" dark extended flat extension-height="64">
      <v-spacer />
      <v-toolbar-items>
        <v-btn icon><v-icon>mdi-account-cog</v-icon></v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <!-- 账户信息卡片 -->
    <AccountInfoCard
      class="pb-6"
      style="margin-top: -56px"
      :account-info="accountInfo"
      @modifyAvatar="sheet = true"
    />

    <!-- 修改头像确认底部 sheet -->
    <v-bottom-sheet v-model="sheet">
      <v-sheet class="text-center rounded-t-xl">
        <v-btn block text x-large @click="openModifyAvatarDialog"
          >修改头像</v-btn
        >
        <v-btn block text x-large @click="sheet = false">关闭</v-btn>
      </v-sheet>
    </v-bottom-sheet>

    <v-dialog v-model="modifyAvatarDialog" max-width="600">
      <v-card class="rounded-lg">
        <v-card-title>上传新的头像</v-card-title>
        <v-card-text class="px-2">
          <v-file-input
            v-model="selectAvatar"
            accept="image/*"
            prepend-icon="mdi-camera"
            filled
            label="选择头像"
            color="primaryAccount"
            class="mx-4"
          ></v-file-input>
          <v-row>
            <v-col
              v-if="selectPhotoSrc"
              cols="12"
              align="center"
              align-self="center"
            >
              <v-avatar width="100%" height="100%">
                <v-img
                  class="rounded-lg"
                  :src="selectPhotoSrc"
                  aspect-ratio="1"
                ></v-img>
              </v-avatar>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn depressed @click="modifyAvatarDialog = false">取消</v-btn>
          <v-btn
            depressed
            color="primaryAccount"
            class="white--text"
            :disabled="selectPhotoSrc === '' || modifyAvatarLoading"
            :loading="modifyAvatarLoading"
            @click="modifyAvatar()"
            >修改头像</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 账户贡献卡片 -->
    <ContributionCard class="pb-6" :contribution="contribution" />
    <div>
      <v-list>
        <v-list-item class="navigation" @click="dosomething">
          <v-list-item-content>
            <v-list-item-title>我参加的任务</v-list-item-title>
          </v-list-item-content>
          <v-list-item-action
            ><v-icon>mdi-chevron-right</v-icon></v-list-item-action
          >
        </v-list-item>
        <v-list-item class="navigation" @click="dosomething">
          <v-list-item-content>
            <v-list-item-title>志愿时长详情</v-list-item-title>
          </v-list-item-content>
          <v-list-item-action
            ><v-icon>mdi-chevron-right</v-icon></v-list-item-action
          >
        </v-list-item>
        <v-list-item class="navigation" @click="dosomething">
          <v-list-item-content>
            <v-list-item-title>帮助反馈</v-list-item-title>
          </v-list-item-content>
          <v-list-item-action
            ><v-icon>mdi-chevron-right</v-icon></v-list-item-action
          >
        </v-list-item>
        <v-list-item class="navigation" @click="dosomething">
          <v-list-item-content>
            <v-list-item-title>在线客服</v-list-item-title>
          </v-list-item-content>
          <v-list-item-action
            ><v-icon>mdi-chevron-right</v-icon></v-list-item-action
          >
        </v-list-item>
        <v-divider class="my-2" />
        <v-list-item class="navigation" @click="logoutConfirmDialog = true">
          <v-list-item-content>
            <v-list-item-title>退出登录</v-list-item-title>
          </v-list-item-content>
          <v-list-item-action><v-icon>mdi-logout</v-icon></v-list-item-action>
        </v-list-item>
      </v-list>
    </div>

    <!-- 登出对话框 -->
    <ConfirmDialog
      v-model="logoutConfirmDialog"
      color="primaryAccount"
      title="登出账户"
      text="您将登出此账户并回到登录界面，确定继续吗？"
      @confirm="logout"
    />

    <!-- 底部通知 -->
    <BottomSnackbar
      v-model="snackbar"
      :text="snackbarText"
      color="primaryAccount"
    />
  </div>
</template>

<script>
import AccountInfoCard from '~/components/account/AccountInfoCard'
import ContributionCard from '~/components/account/ContributionCard'
import BottomSnackbar from '~/components/modal/BottomSnackbar'
import ConfirmDialog from '~/components/modal/ConfirmDialog'

export default {
  components: {
    AccountInfoCard,
    ContributionCard,
    BottomSnackbar,
    ConfirmDialog,
  },
  layout: 'volunteer',
  data: () => ({
    accountInfo: {},
    contribution: {},
    // 修改头像相关
    sheet: false,
    modifyAvatarDialog: false,
    selectAvatar: null,
    selectPhotoSrc: '',
    modifyAvatarLoading: false,
    // 登出对话框
    logoutConfirmDialog: false,
    // 底部通知
    snackbar: false,
    snackbarText: '',
  }),
  watch: {
    selectAvatar(newVal) {
      if (newVal && newVal.length !== 0) {
        const fileReader = new FileReader()
        fileReader.readAsBinaryString(newVal)
        const that = this
        fileReader.onload = function (f) {
          // 此处的 this 为 fileReader
          const src =
            'data:' + newVal.type + ';base64,' + window.btoa(this.result)
          that.selectPhotoSrc = src
        }
      } else {
        this.selectPhotoSrc = ''
      }
    },
  },
  created() {
    this.getInfo()
  },
  mounted() {
    // 调用底部的通知
    this.$Bus.$on('openAccountBottomSnackbar', (text) => {
      this.snackbar = false
      this.$nextTick(() => {
        this.snackbarText = text
        this.snackbar = true
      })
    })
  },
  methods: {
    // TODO: 获取账户信息
    getInfo() {
      // 用户账户信息
      this.accountInfo = {
        uid: 12,
        name: '张伟',
        photo: '/old-woman.jpg',
        telephone: '18980340000',
      }
      this.accountInfo.role = localStorage.volunteerRole
      // 获取用户贡献信息
      this.contribution = {
        v_time: 23,
        task_num: 2,
      }
    },
    // 打开修改头像对话框
    openModifyAvatarDialog() {
      // 重置修改头像对话框
      this.selectAvatar = null
      this.selectPhotoSrc = ''

      this.sheet = false
      this.modifyAvatarDialog = true
    },
    // TODO: 修改头像
    modifyAvatar() {
      this.modifyAvatarLoading = true

      this.modifyAvatarLoading = false
      this.modifyAvatarDialog = false

      this.$Bus.$emit('openAccountBottomSnackbar', '更新头像成功！')
    },
    // to be removed
    dosomething() {
      console.log('click!')
    },
    logout() {
      this.$router.push({
        path: '/',
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.navigation {
  padding: 0 9vw 0 12vw;
}
</style>
