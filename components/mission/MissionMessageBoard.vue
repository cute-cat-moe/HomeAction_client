<template>
  <!-- 任务公告及交流板模板 -->
  <div>
    <v-timeline align-top dense class="pt-0">
      <v-timeline-item v-if="message.length === 0" color="#b3b3b3">
        <v-alert color="#f2f2f2"> 暂无任务公告 </v-alert>
      </v-timeline-item>
      <v-timeline-item
        v-for="(item, index) in message"
        v-else
        :key="index"
        :color="$ValueHandler.getColorFromMissionMessageType(item.type)"
        fill-dot
        class="pb-4"
      >
        <template #icon>
          <MemberAvatar
            :member-info="item.member"
            :click-to-show-dialog="true"
          />
        </template>
        <v-card
          :color="$ValueHandler.getColorFromMissionMessageType(item.type)"
          class="rounded-lg"
          dark
          elevation="1"
        >
          <v-card-title class="py-2 px-4">
            <span class="subtitle-1 font-weight-bold">{{
              item.member.name
            }}</span>
            <v-spacer />
            <span class="subtitle-2 opacity-primary"
              >{{ $Dayjs.getTimeFronNow(item.time) }}前</span
            >
          </v-card-title>
          <v-card-text class="body-1 white text--primary pa-3">
            {{ item.content }}
          </v-card-text>
        </v-card>
      </v-timeline-item>

      <!-- <v-timeline-item fill-dot>
        <template #icon> </template>
      </v-timeline-item> -->
    </v-timeline>
  </div>
</template>

<script>
import MemberAvatar from '~/components/modal/MemberAvatar'

export default {
  components: { MemberAvatar },
  model: {
    prop: 'message',
    event: 'onChangeMessage',
  },
  props: {
    message: {
      type: Array,
      required: true,
      default() {
        return []
      },
    },
  },
  data() {
    return {
      messageList: [],
    }
  },
  watch: {
    message(newVal) {
      this.messageList = newVal
    },
  },
  created() {
    this.messageList = this.message
  },
  methods: {
    // 点击消息卡片时打开阅读对话框
    // openMessageDetailDialog(message) {
    //   console.log(message)
    // },
  },
}
</script>

<style scoped></style>
