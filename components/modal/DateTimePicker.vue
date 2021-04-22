<template>
  <!-- 日期时间选择器对话框 -->
  <v-dialog v-model="dialog" @click:outside="cancel()">
    <v-card class="rounded-lg">
      <v-tabs
        v-model="pickerModel"
        background-color="primary"
        dark
        centered
        slider-color="#FFF59D"
      >
        <v-tab v-for="tab in tabs" :key="tab.name" :href="`#${tab.name}`">{{
          tab.label
        }}</v-tab>
      </v-tabs>

      <v-tabs-items v-model="pickerModel">
        <v-tab-item value="datePicker">
          <v-date-picker
            v-model="pickDate"
            color="accent"
            locale="zh_CN.GBK"
            :max="$Dayjs.formatDateTime(new Date(), 'YYYY-MM-DD')"
            full-width
          ></v-date-picker>
        </v-tab-item>

        <v-tab-item value="timePicker">
          <v-time-picker
            v-model="pickTime"
            color="accent"
            format="24hr"
            full-width
          ></v-time-picker>
        </v-tab-item>
      </v-tabs-items>

      <v-card-actions>
        <v-spacer />
        <v-btn
          depressed
          @click="
            pickerModel === 'datePicker'
              ? cancel()
              : (pickerModel = 'datePicker')
          "
          >{{ pickerModel === 'datePicker' ? '取消' : '上一步' }}</v-btn
        >
        <v-btn
          class="ml-2"
          depressed
          color="primary"
          @click="
            pickerModel === 'datePicker'
              ? (pickerModel = 'timePicker')
              : setDateTime()
          "
          >{{ pickerModel === 'datePicker' ? '继续' : '完成' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  model: {
    prop: 'dateTimePickerDialog',
    event: 'onOpenCloseDateTimePickerDialog',
  },
  props: {
    dateTimePickerDialog: {
      type: Boolean,
      required: true,
      default: false,
    },
    date: {
      type: String,
      required: true,
      default: '',
    },
    time: {
      type: String,
      required: true,
      default: '',
    },
  },
  data: () => ({
    dialog: false,
    pickerModel: 'datePicker',
    pickDate: '',
    pickTime: '',
    tabs: [
      {
        name: 'datePicker',
        label: '日期选择',
      },
      {
        name: 'timePicker',
        label: '时间选择',
      },
    ],
  }),
  watch: {
    // 监听打开和关闭日期时间选择器事件
    dateTimePickerDialog(newVal) {
      if (newVal === true) {
        this.pickDate = this.date
        this.pickTime = this.time
        this.pickerModel = 'datePicker'
        this.dialog = true
      } else {
        this.dialog = false
      }
    },
    // 维护父组件的 v-model
    dialog(newVal) {
      this.$emit('onOpenCloseDateTimePickerDialog', newVal)
    },
  },
  created() {
    this.dialog = this.dateTimePickerDialog
  },
  methods: {
    // 触发父组件传入的 cancel 事件
    cancel() {
      this.$emit('cancel')
      this.dialog = false
    },
    // 触发父组件传入的 setDateTime 事件
    setDateTime() {
      this.$emit('setDateTime', {
        date: this.pickDate,
        time: this.pickTime,
      })
      this.dialog = false
    },
  },
}
</script>
