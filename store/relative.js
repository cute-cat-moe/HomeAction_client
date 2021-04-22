import axios from 'axios'
import NProgress from 'nprogress'

export const state = () => ({
  rid: 1, // 家属id
  phone: '123456', // 家属电话
  password: '123456', // 家属密码
  token: '', // token
  missionID: 0, // 任务id，当id为0时，表示当前没有任务，否则有任务
  missionInfo: {
    // 任务详细信息
    missionDetail: {
      // 任务等级
      level: 0,
      // 任务开始时间
      startTime: 0,
      // 任务结束时间
      endTime: 0,
      // 任务状态，0表示审核未通过，1表示待审核，2表示召集中，3表示进行中，4表示成功结束，5表示失败结束
      status: -2,
      // 已召集志愿者人数
      called: 0,
      // 需要召集的志愿者人数
      need: 0,
      // 任务负责人信息和联系方式
      principal: {
        id: 0, // 任务负责人id
        name: '',
        telephone: '',
      },
    },
    // 老人id
    lostOldId: 0,
    // 任务中老人的具体信息
    lostOldDetail: {
      // 家属信息和联系方式
      relative: {
        id: 0, // 家属id
        name: '',
        telephone: '',
      },
      // 老人的正脸照片，用于人脸识别
      mainPhoto: {
        id: 0,
        path: '',
      },
      // 老人的更多照片
      additionalPhoto: [],
      // 老人的姓名
      name: '',
      // 老人的性别
      gender: '',
      // 老人的年龄
      age: '',
      // 老人的走失地点，或最后已知地点
      lastKnownLocation: {
        name: '',
        lnglat: [],
      },
      // 老人的常去地点
      starLocation: [],
      // 老人走失的日期
      lostDate: '',
      // 老人走失的时间
      lostTime: '',
      // 老人走失时间的时间戳，已毫秒为单位
      lost_time: 0,
      // 老人的籍贯
      nativePlace: '',
      // 老人的疾病史
      diseaseHistory: '',
      // 老人的体态特征
      posture: '',
      // 老人的衣着特征
      clothing: '',
      // 老人的其它特征
      otherChara: '',
      // 老人的补充信息
      otherInfo: '',
    },
    missionMessage: [],
    missionFeedback: [],
    uncertainOld: [],
  },
})

export const mutations = {
  updateLogin(state, value) {
    state.token = value.token
    state.missionID = value.missionID
    state.rid = value.rid
  },
  updateMission(state, value) {
    state.missionID = value
  },
  updateUpload(state, value) {
    state.missionID = value.missionID
    state.missionInfo.lostOldId = value.oid
  },
  updateMissionInfo(state, value) {
    state.missionInfo.missionDetail = value.missionDetail
    state.missionInfo.lostOldId = value.lostOldId
    state.missionInfo.lostOldDetail = value.lostOldDetail
  },
  updateTest(state, value) {
    // state.missionInfo.lostOldDetail.name = value
    state.missionInfo.missionDetail.status = value
  },
  updateTestStatus(state) {
    // state.missionInfo.lostOldDetail.name = value
    state.missionInfo.missionDetail.status =
      (state.missionInfo.missionDetail.status % 4) + 1
  },
  updateMissionMessage(state, value) {
    state.missionInfo.missionMessage = value
  },
  updateMissionFeedback(state, value) {
    state.missionInfo.missionFeedback = value
  },
  updateUncertainOld(state, value) {
    state.missionInfo.uncertainOld = value
  },
}

export const actions = {
  login({ commit, state }) {
    const postData = {
      rid: state.rid,
      phone: state.phone,
      password: state.password,
    }
    axios
      .post('http://localhost:3000/relation/user/login', postData)
      .then((Response) => {
        if (Response.data) {
          const value = {
            token: Response.data.data.token,
            missionID: Response.data.data.missionID,
          }
          commit('updateState', value)
          NProgress.done()
        } else {
          const value = {
            token: '',
            missionID: 0,
          }
          commit('updateState', value)
        }
      })
  },
}

export default {
  namespaced: true, // 命名空间
  state,
  // getters,
  actions,
  mutations,
}
