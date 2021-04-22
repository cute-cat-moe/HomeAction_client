<template>
  <!-- eslint-disable vue/no-use-v-if-with-v-for -->
  <v-card outlined elevation="1" class="rounded-lg">
    <v-card-title>第 {{ team.teamId }} 小队</v-card-title>
    <v-card-subtitle>已有 {{ team.teamMembers.length }} 人</v-card-subtitle>
    <v-card-text>
      <v-row>
        <v-col
          v-for="(member, index) in team.teamMembers"
          v-if="index < showMemberLimit"
          :key="member.uid"
          align="center"
          cols="2"
        >
          <MemberAvatar :member-info="member" :click-to-show-dialog="true" />
        </v-col>
      </v-row>
    </v-card-text>
    <v-divider class="mx-2" />
    <v-card-actions>
      <v-spacer />
      <v-btn
        v-if="team.teamMembers.length > 6"
        depressed
        @click="showAllMembers()"
        >{{ showMemberLimit === 6 ? '显示全部成员' : '隐藏更多成员' }}</v-btn
      >
      <v-btn
        depressed
        color="primaryMission"
        class="white--text"
        :disabled="disabled"
        @click="joinTeamConfirmDialog = true"
        >{{ disabled ? '您是领队' : '加入小队' }}</v-btn
      >
      <ConfirmDialog
        v-model="joinTeamConfirmDialog"
        title="加入小队"
        :text="`加入小队后您将无法再退出小队，且离开救援任务再加入仍将隶属于此小队。您确定要加入第 ${team.teamId} 小队吗？`"
        confirm-text="确认加入小队"
        color="primaryMission"
        @confirm="joinTeam()"
      />
    </v-card-actions>
  </v-card>
</template>

<script>
import ConfirmDialog from '~/components/modal/ConfirmDialog'
import MemberAvatar from '~/components/modal/MemberAvatar'

export default {
  components: { ConfirmDialog, MemberAvatar },
  props: {
    // 需要包括 team.id, team.teamMembers 项
    team: {
      type: Object,
      required: true,
    },
    // 领队无法加入小队
    disabled: {
      type: Boolean,
      required: true,
    },
  },
  data: () => ({
    // 显示小队成员数量，默认为 6 人
    showMemberLimit: 6,
    joinTeamConfirmDialog: false,
  }),
  methods: {
    showAllMembers() {
      switch (this.showMemberLimit) {
        case 6:
          this.showMemberLimit = Infinity
          break
        case Infinity:
          this.showMemberLimit = 6
          break
        default:
          this.showMemberLimit = 6
      }
    },
    // 调用父组件传入的 joinTeam 方法
    joinTeam() {
      this.$emit('joinTeam')
    },
  },
}
</script>
