<template>
  <div>
    <v-card>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-file-input
                v-model="mission.lostOldDetail.recentPhoto"
                label="老人近期照片"
                accept="image/*"
                prepend-icon="mdi-camera"
                hint="修改走失老人的近期照片。"
                persistent-hint
              ></v-file-input>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="mission.lostOldDetail.name"
                label="老人姓名"
                value=""
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-select
                v-model="mission.lostOldDetail.gender"
                :items="['男', '女']"
                label="老人性别"
                persistent-hint
                required
              ></v-select>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="mission.lostOldDetail.age"
                label="老人年龄*"
                value=""
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="mission.lostOldDetail.lastKnownLocation"
                label="老人走失地点"
                value=""
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="mission.lostOldDetail.nativePlace"
                label="老人籍贯*"
                value=""
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="mission.lostOldDetail.diseaseHistory"
                label="老人疾病史*"
                value=""
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="mission.lostOldDetail.posture"
                label="老人体态特征*"
                value=""
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="mission.lostOldDetail.clothing"
                label="老人衣着特征*"
                value=""
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="mission.lostOldDetail.otherChara"
                label="老人其它特征*"
                value=""
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="mission.lostOldDetail.otherInfo"
                label="其他信息*"
                value=""
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
        <small>*表明非必需字段</small>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'UpdateOldInfo',
  props: {
    mission: {
      type: Object,
      required: true,
    },
  },
}
</script>

<style scoped></style>
