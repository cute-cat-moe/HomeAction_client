<template>
  <!-- 账户信息卡片 -->
  <div>
    <v-card
      class="mx-auto rounded-lg pa-4"
      max-width="700"
      width="80vw"
      outlined
      elevation="1"
    >
      <v-row no-gutters>
        <v-col cols="4" align-self="center" align="center">
          <v-avatar
            color="grey lighten-4"
            height="100%"
            width="100%"
            @click="$emit('modifyAvatar')"
          >
            <v-img
              v-if="accountInfo.photo"
              :src="accountInfo.photo"
              aspect-ratio="1"
            />
            <span v-else class="body-1 black--text opacity-primary">{{
              accountInfo.name[0]
            }}</span>
          </v-avatar>
        </v-col>
        <v-col cols="8" align-self="center">
          <v-card-subtitle class="pb-0"
            >志愿者编号 {{ accountInfo.uid }}</v-card-subtitle
          >
          <v-card-title class="pt-1"
            >{{ accountInfo.name
            }}<v-chip
              class="ml-2"
              :color="
                accountInfo.role === 'volunteer' ? 'primaryAccount' : '#EF6C00'
              "
              dark
              >{{
                accountInfo.role === 'volunteer' ? '志愿者' : '志愿者领队'
              }}</v-chip
            ></v-card-title
          >
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    accountInfo: {
      type: Object,
      required: true,
    },
  },
}
</script>
