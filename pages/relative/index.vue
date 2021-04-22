<template>
  <div>
    <!--    <v-app-bar color="primary" app dark dense fixed>-->
    <!--      <v-icon>mdi-table-edit</v-icon>-->
    <!--      <v-app-bar-title class="ml-1"> 救援申请 </v-app-bar-title>-->
    <!--    </v-app-bar>-->
    <AppBar :mode="1" />

    <!--    style="border-bottom-width: 12px; border-color: #f6daaf"-->
    <v-card color="#f2f2f2" elevation="6" class="rounded-lg" outlined>
      <v-img
        :src="bg[1]"
        gradient="to bottom, rgba(0,0,0,.11), rgba(0,0,0,.15)"
        height="200px"
      >
      </v-img>

      <v-card-title class="headline relativeColor--text">
        <v-icon left color="relativeColor">mdi-clipboard-edit-outline</v-icon>
        搜救申请
      </v-card-title>

      <v-card-text>
        <v-row align="center" class="mx-0">
          <v-col> 点击下方按钮，完成走失老人信息填写即可进行救援申请。 </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          class="mx-2"
          dark
          color="relativeColor"
          @click="editLostOldDetail"
        >
          <v-icon left dark> mdi-clipboard-edit-outline </v-icon>
          填写信息
        </v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import AppBar from '~/components/index/AppBar'
import store from '~/store/index'
export default {
  components: {
    AppBar,
    store,
  },
  layout: 'relative',
  data: () => ({
    bg: ['/bg/bg_1.png', '/归家行动.png'],
  }),

  methods: {
    editLostOldDetail() {
      this.$Bus.$emit('editLostOldDetail', {
        mode: 'create',
        lostOldId: '23124',
      })
    },
  },
}
</script>
