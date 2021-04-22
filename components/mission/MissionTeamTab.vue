<template>
  <!-- 小队页面 -->
  <div>
    <!-- 加载中 -->
    <div v-if="loading">
      <v-row no-gutters>
        <v-col cols="12" align="center">
          <Loading v-model="loading" text="正在加载小队信息中" />
        </v-col>
      </v-row>
    </div>
    <!-- 已加入小队时 -->
    <div v-else-if="teamId">
      <!-- 展示当前小队的全体成员 -->
      <ContentTitle> 小队成员 </ContentTitle>
      <v-row>
        <v-col
          v-for="member in teamMembers"
          :key="member.uid"
          align="center"
          cols="3"
        >
          <MemberAvatar
            :member-info="member"
            :name="member.name"
            :name-chip="member.leader ? '队长' : member.quit ? '离队' : ''"
            :name-chip-color="member.leader ? 'primaryMission' : ''"
            :name-chip-dark="member.leader ? true : false"
            :show-name="true"
            :click-to-show-dialog="true"
          />
        </v-col>
      </v-row>
      <!-- 小队队长和成员都可以添加留言 -->
      <ContentTitle>
        小队留言板
        <template #action>
          <v-btn icon @click="missionMessageAddDialog = true"
            ><v-icon>mdi-feather</v-icon></v-btn
          >
        </template>
      </ContentTitle>
      <MissionMessageBoard v-model="teamMessage" />
      <MissionMessageAddDialog
        v-model="missionMessageAddDialog"
        :team-id="teamId"
        @addMessage="addTeamMessage"
      />
    </div>
    <!-- 未加入小队时 -->
    <div v-else>
      <ContentTitle>
        {{ role === 'volunteer' ? '加入小队' : '小队列表' }}
        <template #action>
          <!-- 创建小队 -->
          <!-- 1. 志愿者创建小队，创建者将成为小队队长 -->
          <!-- 2. 队长不能改变，且队长不能离开任务 -->
          <v-btn
            icon
            :disabled="role !== 'volunteer'"
            @click="confirmCreateTeamDialog = true"
            ><v-icon>mdi-flag-plus-outline</v-icon></v-btn
          >
          <ConfirmDialog
            v-model="confirmCreateTeamDialog"
            title="创建小队"
            text="您将创建一支新的小队并成为小队的队长，您将不能转让队长或离开本任务。您确定要创建小队吗？"
            color="primaryMission"
            confirm-input="确认创建"
            @confirm="createTeam()"
          />
        </template>
      </ContentTitle>
      <!-- 加入小队 -->
      <!-- 1. 只有志愿者可以加入小队 -->
      <!-- 2. 志愿者加入小队后，不能再离开小队 -->
      <!-- 3. 志愿者加入小队后，离开任务再回来将仍隶属于该小队 -->
      <div v-for="team in teamList" :key="team.teamId" class="mb-4">
        <MissionTeamListCard
          :team="team"
          :disabled="role !== 'volunteer'"
          @joinTeam="joinTeam(team.teamId)"
        />
      </div>
      <v-row v-if="teamList.length === 0" no-gutters>
        <v-col cols="12" align="center" align-self="center">
          <EmptyStatus
            icon="mdi-flag-variant-outline"
            text="暂无可用小队，您可以点击右上方创建一支新的小队"
            hide-button
            color="primaryMission"
          />
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import Loading from '~/components/modal/Loading'
import ContentTitle from '~/components/modal/ContentTitle'
import ConfirmDialog from '~/components/modal/ConfirmDialog'
import MemberAvatar from '~/components/modal/MemberAvatar'
import EmptyStatus from '~/components/modal/EmptyStatus'
import MissionMessageBoard from '~/components/mission/MissionMessageBoard'
import MissionTeamListCard from '~/components/mission/MissionTeamListCard'

export default {
  components: {
    Loading,
    ContentTitle,
    ConfirmDialog,
    MemberAvatar,
    EmptyStatus,
    MissionMessageBoard,
    MissionTeamListCard,
  },
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
  data: () => ({
    // 加载小队状态
    loading: true,
    // 小队编号，为空时表示尚未加入小队
    // 队长不可退出小队，也不能退出任务
    // 队员加入小队后不可再退出小队，只能直接退出任务
    // 重新加入任务时自动回到原来的小队里
    teamId: '',
    // 创建小队对话框
    confirmCreateTeamDialog: false,
    // 小队编号不为空时显示当前小队成员
    teamMembers: [],
    // 小队编号不为空时显示当前小队的留言板信息
    teamMessage: [],
    // 小队留言板对话框
    missionMessageAddDialog: false,
    // 小队编号为空时显示任务小队列表
    teamList: [],
  }),
  created() {
    this.queryTeamInfo()
  },
  methods: {
    // TODO: 获取该任务中志愿者加入的小队信息
    // 根据 mission.missionMemberDetail 和 mission.missionTeamDetail 获取
    // 1: 志愿者尚未加入小队
    // 若 mission.missionTeamDetail 中所有小队都不包含当前志愿者的 uid，则当前志愿者尚未加入小队
    // 则根据 mission.missionMemberDetail 和 mission.missionTeamDetail 计算获得 teamList
    // 2: 志愿者已加入小队
    // 若 mission.missionTeamDetail 中某个小队包含当前志愿者的 uid，则当前志愿者已经加入小队
    // 此小队的编号设置为 teamId
    // 根据 mission.missionMemberDetail 和 mission.missionTeamDetail 计算获得当前小队的 teamMembers
    // 从后端获取此小队的留言板信息 teamMessage
    // 3: 指挥，只能创建但不能加入小队
    // 根据 mission.missionMemberDetail 和 mission.missionTeamDetail 计算获得 teamList
    queryTeamInfo() {
      // this.teamId = '123'
      if (this.teamId) {
        // 志愿者已经加入小队，获取当前小队信息
        this.teamMembers = [
          {
            uid: 1,
            name: '璟珅',
            avatar: '',
            leader: true,
          },
          {
            uid: 2,
            name: '阿菲',
            avatar: '',
          },
          {
            uid: 3,
            name: '牛仔',
            avatar: '',
          },
          {
            uid: 4,
            name: '益生',
            avatar: '',
          },
          {
            uid: 5,
            name: 'Eason',
            avatar: '',
          },
          {
            uid: 6,
            name: 'Jay Chou',
            avatar: '',
            quit: true,
          },
        ]
        this.teamMessage = [
          {
            tid: 2,
            type: 'accent',
            time: new Date().getTime() - 10000,
            content:
              'A pull-down refresh and pull-up load more and infinite scroll component for Vue.js.',
            member: {
              uid: 1,
              name: '璟珅',
              avatar: '',
            },
          },
          {
            tid: 1,
            time: new Date().getTime() - 1000050,
            content: 'Advanced debug can be achieved with testcafe-live, e.g.',
            member: {
              uid: 4,
              name: '益生',
              avatar: '',
            },
          },
          {
            tid: 0,
            time: new Date().getTime() - 1000055,
            content: '这是一条队内语音，收到的小伙伴请举手！',
            member: {
              uid: 3,
              name: '牛仔',
              avatar: '',
            },
          },
        ]
      } else {
        // 志愿者尚未加入小队，获取任务小队列表
        this.teamList = [
          {
            teamId: '135',
            teamMembers: [
              {
                uid: -1,
                name: '彬彬',
                avatar: '',
              },
              {
                uid: 0,
                name: '阿伟',
                avatar: '',
              },
              {
                uid: 1,
                name: '璟珅',
                avatar: '',
                leader: true,
              },
              {
                uid: 2,
                name: '阿菲',
                avatar: '',
              },
              {
                uid: 3,
                name: '牛仔',
                avatar: '',
              },
              {
                uid: 4,
                name: '益生',
                avatar: '',
              },
              {
                uid: 5,
                name: 'Eason',
                avatar: '',
              },
              {
                uid: 6,
                name: 'Jay Chou',
                avatar: '',
                quit: true,
              },
            ],
          },
          {
            teamId: '136',
            teamMembers: [
              {
                uid: 1,
                name: '璟珅',
                avatar: '',
                leader: true,
              },
              {
                uid: 2,
                name: '阿菲',
                avatar: '',
              },
              {
                uid: 3,
                name: '牛仔',
                avatar: '',
              },
              {
                uid: 4,
                name: '益生',
                avatar: '',
              },
              {
                uid: 5,
                name: 'Eason',
                avatar: '',
              },
              {
                uid: 6,
                name: 'Jay Chou',
                avatar: '',
                quit: true,
              },
            ],
          },
          {
            teamId: '137',
            teamMembers: [
              {
                uid: 1,
                name: '璟珅',
                avatar: '',
                leader: true,
              },
              {
                uid: 3,
                name: '牛仔',
                avatar: '',
              },
              {
                uid: 4,
                name: '益生',
                avatar: '',
              },
              {
                uid: 5,
                name: 'Eason',
                avatar: '',
              },
              {
                uid: 6,
                name: 'Jay Chou',
                avatar: '',
                quit: true,
              },
            ],
          },
        ]
      }
      this.loading = false
    },
    // TODO: 志愿者创建小队
    // 创建小队的志愿者将成为小队队长
    createTeam() {
      console.log(`创建小队：${missionId}`)
      const missionId = this.mission.missionDetail.missionId
      this.teamId = '998'
      this.queryTeamInfo()
    },
    // TODO: 志愿者加入小队
    // 成功加入后须维护父组件 mission.missionTeamDetail 信息
    joinTeam(teamId) {
      console.log(`加入小队：${teamId}`)
      this.teamId = teamId
      this.queryTeamInfo()
    },
    // TODO: 添加消息到小队留言板
    addTeamMessage(msg) {
      const content = msg.content
      // 内容不能为空
      if (!!content === false) {
        return
      }

      // 从当前组件的 teamMembers 项获取成员资料
      const uid = 1
      let member
      for (const memberInfo of this.teamMembers) {
        if (memberInfo.uid === uid) {
          member = memberInfo
          break
        }
      }

      // 未找到对应的用户信息
      if (member === undefined) {
        return
      }

      const type = msg.type || 'default'
      const time = msg.time || new Date().getTime()

      // TODO: 添加信息到数据库

      // 通知操作完成
      this.$Bus.$emit(
        'openMissionBottomSnackbar',
        '您成功添加了任务小队留言，信息将同步到飞书小队群聊'
      )

      // 添加信息到当前页面的留言板中
      const message = {
        type,
        time,
        content,
        member,
      }
      this.teamMessage.unshift(message)
    },
  },
}
</script>
