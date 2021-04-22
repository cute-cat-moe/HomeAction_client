<template>
  <!-- 志愿者信息卡片 -->
  <div>
    <v-card class="rounded-lg" outlined>
      <v-row no-gutters>
        <v-col cols="4" align-self="center" align="end">
          <MemberAvatar
            :member-info="memberInfo"
            :click-to-show-dialog="true"
          />
        </v-col>
        <v-col cols="8" align-self="center" align="start">
          <v-card-title class="px-2">{{ memberInfo.name }}</v-card-title>
          <v-card-subtitle v-if="memberInfo.tid" class="px-2"
            >第 {{ memberInfo.tid }} 小队<span>{{
              memberInfo.leader ? '队长' : ''
            }}</span></v-card-subtitle
          >
        </v-col>
        <v-col v-if="memberInfo.quit" cols="12" align="start">
          <v-divider class="pb-4 mx-2" />
          <v-card-text class="pt-0 px-4">
            <v-chip small class="mr-1">离队</v-chip
            >{{ memberInfo.quitReason }}</v-card-text
          >
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
import MemberAvatar from '~/components/modal/MemberAvatar'

export default {
  components: { MemberAvatar },
  props: {
    memberInfo: {
      type: Object,
      required: true,
    },
  },
}
</script>
