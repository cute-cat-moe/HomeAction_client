<template>
  <div>
    <AppBar :mode="2" />
    <MainVisualCard :news="news" />
    <ContentTitle> 走失老人 </ContentTitle>
    <v-card class="rounded-lg pa-3" outlined elevation="1">
      <v-row>
        <v-col
          v-for="lostOldInfo in lostOldSnapshot"
          :key="lostOldInfo.lostOldId"
          cols="3"
          align="center"
        >
          <ConvenerSnapshot
            :lost-old-photo="lostOldInfo.lostOldPhoto"
            :lost-old-name="lostOldInfo.lostOldName"
          />
        </v-col>
      </v-row>
    </v-card>
    <ContentTitle> 动态要闻 </ContentTitle>
    <div v-for="item in news" :key="item.nid">
      <NewsCard
        :type="item.type"
        :photo="item.photo"
        :title="item.title"
        :content="item.content"
        :date="item.date"
        :location="item.location"
        class="mb-4"
      />
    </div>
  </div>
</template>

<script>
  import AppBar from '~/components/index/AppBar'
  import MainVisualCard from '~/components/index/MainVisualCard'
  import ContentTitle from '~/components/modal/ContentTitle'
  import ConvenerSnapshot from '~/components/index/ConvenerSnapshot'
  import NewsCard from '~/components/index/NewsCard'

  export default {
    components: {
      AppBar,
      MainVisualCard,
      ContentTitle,
      ConvenerSnapshot,
      NewsCard,
    },
    layout: 'relative',
    data: () => ({
      lostOldSnapshot: [
        {
          lostOldId: 1,
          lostOldPhoto: '/old-man.jpg',
          lostOldName: '姓名',
        },
        {
          lostOldId: 2,
          lostOldPhoto: '/old-woman.jpg',
          lostOldName: '姓名',
        },
        {
          lostOldId: 3,
          lostOldPhoto: '/old-man.jpg',
          lostOldName: '姓名',
        },
        {
          lostOldId: 4,
          lostOldPhoto: '/old-woman.jpg',
          lostOldName: '姓名',
        },
      ],
      news: [
        {
          nid: '1252436',
          type: 'news',
          photo: '/volunteer-1.jpg',
          title: '归家行动新闻1',
          content:
            'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
          date: new Date().getTime(),
          location: '成都市成华区',
        },
        {
          nid: '125243646',
          type: 'rescue',
          photo: '/volunteer-2.jpg',
          title: '归家行动新闻2',
          content:
            'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
          date: new Date().getTime() - 100000000,
          location: '成都市郫都区',
        },
        {
          nid: '125243836',
          type: 'platform',
          photo: '/volunteer-3.jpg',
          title: '归家行动新闻3',
          content:
            'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
          date: new Date().getTime() - 1000000000,
          location: '成都市金牛区',
        },
        {
          nid: '1252432836',
          title: '归家行动新闻4',
          content:
            'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
          date: new Date().getTime() - 15000000000,
          location: '成都市金牛区',
        },
      ],
    }),
    created() {
      // TODO: 获取新闻信息
    },
    methods: {},
  }
</script>
