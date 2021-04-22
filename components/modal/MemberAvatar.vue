<template>
  <!-- 志愿者头像模板 -->
  <div>
    <v-avatar :color="color" :size="size" @click="openMemberDialog">
      <v-img v-if="memberInfo.avatar" :src="memberInfo.avatar"></v-img>
      <span v-else class="body-1 black--text opacity-primary">{{
        memberInfo.name[0]
      }}</span>
    </v-avatar>
    <div v-if="showName" class="pt-1 body-2 opacity-primary">
      {{ name ? name : memberInfo.name
      }}<v-chip
        v-if="nameChip"
        small
        :color="nameChipColor"
        :dark="nameChipDark"
        class="ma-1"
        >{{ nameChip }}</v-chip
      >
    </div>
  </div>
</template>

<script>
export default {
  props: {
    memberInfo: {
      type: Object,
      required: true,
    },
    // 头像背景颜色
    color: {
      type: String,
      required: false,
      default: 'grey lighten-4',
    },
    // 显示名字模板，不为空时显示传入的值
    // 须设置 showName = true
    name: {
      type: String,
      required: false,
      default: '',
    },
    // 紧跟在名字后边的小卡片
    // 须设置 showName = true
    nameChip: {
      type: String,
      required: false,
      default: '',
    },
    // 名字后边小卡片的颜色
    // 须设置 showName = true 且 nameChip 不为空
    nameChipColor: {
      type: String,
      required: false,
      default: '',
    },
    // 名字后边小卡片文字颜色
    // 须设置 showName = true 且 nameChip 不为空
    // nameChipDark 为 true 时文字颜色为白色，若未设置 nameChipColor 则自动变为深色
    // nameChipDark 为 false 时文字颜色为黑色，若未设置 nameChipColor 则自动变为浅色
    nameChipDark: {
      type: Boolean,
      required: false,
      default: false,
    },
    // 显示名字
    // name 为空时显示 memberInfo.name
    // name 不为空时显示 name 传入的值
    showName: {
      type: Boolean,
      required: false,
      default: false,
    },
    // 头像大小
    size: {
      type: Number,
      required: false,
      default: 48,
    },
    // 点击头像时显示成员信息对话框
    clickToShowDialog: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  methods: {
    // 打开 ~/components/app/MemberDialog 展示成员信息
    openMemberDialog() {
      if (this.clickToShowDialog) {
        this.$Bus.$emit('openMemberDialog', this.memberInfo)
      }
    },
  },
}
</script>
