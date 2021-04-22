<template>
  <!-- 添加 MissionMessageBoard 中消息的对话框 -->
  <v-dialog v-model="dialog" :persistent="content !== ''">
    <v-card class="rounded-lg">
      <v-card-title>{{
        teamId ? '添加小队留言' : '发表任务公告'
      }}</v-card-title>
      <v-card-subtitle>{{
        teamId
          ? '只有您的小队成员可以看到小队留言'
          : '所有参与任务的志愿者都可以看到任务公告'
      }}</v-card-subtitle>
      <v-card-text>
        <v-form ref="form" v-model="form" lazy-validation>
          <v-chip-group
            v-model="type"
            mandatory
            active-class="primaryMission--text"
          >
            <v-chip
              v-for="item in typeItems"
              :key="item.value"
              :value="item.value"
            >
              {{ item.text }}
            </v-chip>
          </v-chip-group>
          <v-textarea
            v-model="content"
            :label="teamId ? '留言内容' : '公告内容'"
            :rules="rules.contentRule"
            color="primaryMission"
            filled
            rows="2"
            autofocus
            auto-grow
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn depressed @click="cancel()">取消</v-btn>
        <v-btn
          class="ml-2"
          depressed
          color="primaryMission"
          dark
          :loading="loading"
          @click="addMessage()"
          >{{ teamId ? '添加留言' : '发表公告' }}</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  model: {
    prop: 'addMessageDialog',
    event: 'onOpenCloseAddMessageDialog',
  },
  props: {
    addMessageDialog: {
      type: Boolean,
      required: true,
      default: false,
    },
    // 当 teamId 为空时表示任务公告
    // 当 teamId 不为空时表示小队留言
    teamId: {
      type: String,
      required: false,
      default: undefined,
    },
  },
  data: () => ({
    form: true,
    dialog: false,
    type: 'default',
    typeItems: [
      {
        text: '消息',
        value: 'default',
      },
      {
        text: '建议',
        value: 'info',
      },
      {
        text: '关注',
        value: 'accent',
      },
      {
        text: '警告',
        value: 'danger',
      },
    ],
    content: '',
    loading: false,
    rules: {
      contentRule: [(v) => !!v || '内容不能为空'],
    },
  }),
  watch: {
    addMessageDialog(newVal) {
      this.dialog = newVal
    },
    dialog(newVal) {
      this.$emit('onOpenCloseAddMessageDialog', newVal)
    },
  },
  created() {
    this.dialog = this.addMessageDialog
  },
  methods: {
    cancel() {
      this.dialog = false
    },
    // TODO: 点击确认按钮添加一条信息
    addMessage() {
      if (this.content === '') {
        return false
      }
      if (this.$refs.form.validate()) {
        this.loading = true

        const type = this.type
        const content = this.content
        const time = new Date().getTime()

        this.loading = false
        this.dialog = false

        // 调用父组件的添加消息的方法
        this.$emit('addMessage', {
          type,
          content,
          time,
        })

        // 初始化当前对话框表单值
        this.type = 'default'
        this.content = ''
        this.$refs.form.reset()
      }
    },
  },
}
</script>
