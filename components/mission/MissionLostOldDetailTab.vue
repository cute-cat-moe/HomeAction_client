<template>
  <!-- 走失老人详细信息页面 -->
  <div>
    <!-- 展示走失老人的信息 -->
    <ContentTitle>
      走失老人信息
      <!-- 指挥可以即时修改走失老人信息 -->
      <template #action>
        <v-btn v-if="role === 'leader'" icon @click="editLostOldDetail"
          ><v-icon>mdi-table-edit</v-icon></v-btn
        >
      </template>
    </ContentTitle>
    <v-card class="rounded-lg" outlined elevation="1">
      <MissionLostOldDetail :lost-old-detail="mission.lostOldDetail" />
    </v-card>

    <LostOldDetailEditorDialog />
  </div>
</template>

<script>
import ContentTitle from '~/components/modal/ContentTitle'
import MissionLostOldDetail from '~/components/modal/LostOldDetail'

import LostOldDetailEditorDialog from '~/components/app/LostOldDetailEditorDialog'

export default {
  components: { ContentTitle, MissionLostOldDetail, LostOldDetailEditorDialog },
  props: {
    mission: {
      type: Object,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
  },
  data: () => ({}),
  mounted() {},
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
